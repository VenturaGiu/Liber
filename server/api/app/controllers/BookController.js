const fetch = require('node-fetch');
const _ = require('underscore');
const Genre = require('../models/Genre')
const GenreController = require('../controllers/GenreController')
const { ObjectId } = require('mongoose').Types;
const Book = require('../models/Book')

async function translate_word(word) {
    const resp = await fetch("http://localhost:5000/translate", {
        method: "POST",
        body: JSON.stringify({
            q: word,
            source: "en",
            target: "pt",
            format: "text",
            api_key: ""
        }),
        headers: { "Content-Type": "application/json" }
    });
    const translate = await resp.json()
    return translate.translatedText
}

async function getGenreOrSave(names) {
    const genres = []
    names = typeof names === 'string' ? [names] : names
    for (const name of names) {
        const resp = await Genre.findOne({ name })
        if (resp) genres.push(ObjectId(resp._id))
    }
    if (_.isEmpty(genres)) {
        const tag = await GenreController.createTag(names[0])
        const genre = new Genre({ name: names[0], tag })
        await genre.save()
        genres.push(ObjectId(genre._id))
    }
    return genres
}

async function parseSubject(subject) {
    let parse = subject.includes(';') === true ? subject.split('; ') : subject
    parse = subject.includes('- ') === true ? subject.split('- ') : parse
    parse = subject.includes(', ') === true ? subject.split(', ') : parse
    parse = subject.includes(' (') === true ? subject.split(' (')[0].replace(' (', '') : parse
    parse = subject.includes('Fiction') === true ? 'Ficção' : parse
    return parse
}

async function generateBookDefault(objBook) {
    try {
        if (objBook.sinopse === '' || typeof objBook.sinopse !== 'string') {
            console.log(objBook.sinopse + ' Sem sinopse :(')
            return 'nada'
        }

        const authors = []
        objBook.contribuicao.forEach(con => {
            authors.push(con.tipo_de_contribuicao === 'Autor' ? `${con.nome} ${con.sobrenome}` : next)
        });

        const genres_search = [ await parseSubject(objBook.catalogacao.areas) ]
        objBook.catalogacao.palavras_chave.split(', ').forEach(async pc => {
            genres_search.push(await parseSubject(pc))
        });
        const id_genre = await getGenreOrSave(genres_search)

        const book = {
            title: objBook.titulo,
            subtitle: objBook.subtitulo,
            isbn: objBook.isbn,
            authors: authors,
            synopsis: objBook.sinopse,
            publisher: objBook.editora.nome_fantasia,
            year: objBook.ano_edicao,
            location: objBook.origem,
            language: objBook.idioma,
            page_count: Number(objBook.medidas.paginas),
            dimensions: {
                height: objBook.medidas.altura,
                width: objBook.medidas.largura,
            },
            key_words: objBook.catalogacao.palavras_chave.split(', '),
            genre: id_genre,
        }
        console.log(book)
    
        const resp = new Book(book)
        await resp.save()
        return resp
    } catch (error) {
        console.log(error)
    }
}

async function getBookByISBN(req, res) {
    try {
        const { isbn } = req.params

        const resp = await Book.findOne({ isbn })
        if (resp) return res.status(200).json(resp)

        let response = await fetch(`https://api.mercadoeditorial.org/api/v1.2/book?isbn=${isbn}`);
        let book = await response.json()

        if (book.status.message === "Nenhum registro foi encontrado") { //outra api pra ver se tem o dado
            response = await fetch(`https://brasilapi.com.br/api/isbn/v1/${isbn}`);
            book = await response.json()

            if (book.message === 'ISBN inválido') return res.status(200).json('Não encontramos esse ISBN em nossa base de dados!')
            if (typeof book.synopsis === 'string') {
                const id_genre = []
                const subjects = []
                for (const subject of book.subjects) {
                    const resps = await parseSubject(subject)
                    if (typeof resps !== 'string') for (const resp of resps) subjects.push(resp)
                    else subjects.push(resps)
                }
                if (subjects) id_genre.push(await getGenreOrSave(subjects))
                book.genre = id_genre
                book.key_words = subjects

                const resp = new Book(book)
                await resp.save()
                console.log('OK')
                return res.status(200).json(resp)
            } else {
                console.log(book.synopsis + ' Sem sinopse :(')
                return res.status(200).json('Sem sinopse :(')
            }
        }

        let objBook = await generateBookDefault(book.books[0])
        console.log('OK')
        return res.status(200).json(objBook)
    } catch (error) {
        return res.status(500).json(error)
    }
}


module.exports = {
    getBookByISBN
}