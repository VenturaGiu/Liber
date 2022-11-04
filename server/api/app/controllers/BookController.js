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

async function getGenreOrSave(name) {
    let genre = await Genre.findOne({ name })
    if(!genre){
        const tag = await GenreController.createTag(name)
        genre = new Genre({ name, tag })
        await genre.save()
        return genre._id
    }
    return genre._id
}

async function parseSubject(subject) {
    let parse = subject.includes(';') === true ?  subject.split('; ') : subject
    parse = subject.includes('- ') === true ?  subject.split('- ') : parse
    parse = subject.includes(', ') === true ?  subject.split(', ') : parse
    parse = subject.includes(' (') === true ?  subject.split(' (')[0].replace(' (', '') : parse
    parse = subject.includes('Fiction') === true ?  'Ficção' : parse
    return parse
}

async function generateBookDefault(objBook) {
    const authors = [] 
    objBook.contribuicao.forEach(con => {
        authors.push(con.tipo_de_contribuicao === 'Autor' ? `${con.nome} ${con.sobrenome}`: next)
    });
    const id_genre = await getGenreOrSave(objBook.catalogacao.areas)
    console.log(objBook.catalogacao.palavras_chave.split(', '))
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
        genre: ObjectId(id_genre),
    }

    if(!_.isEmpty(book.synopsis)){
        const resp = new Book(book)
        await resp.save()
    }else {
        console.log('Sem sinopse :(')
        console.log('Sem Sinopse :(')
    }
    return resp
}

async function getBookByISBN(req, res) {
    try {
        const { isbn } = req.params

        const resp = await Book.findOne({ isbn })
        if(resp) return res.status(200).json(resp)

        let response = await fetch(`https://api.mercadoeditorial.org/api/v1.2/book?isbn=${isbn}`);
        let book = await response.json()

        if (book.status.message === "Nenhum registro foi encontrado") { //outra api pra ver se tem o dado
            response = await fetch(`https://brasilapi.com.br/api/isbn/v1/${isbn}`);
            book = await response.json()
            
            if(book.message === 'ISBN inválido') return res.status(200).json({ message: 'Não encontramos esse ISBN em nossa base de dados!'})
            
            if(!_.isEmpty(book.synopsis)){
                const id_genre = []
                const subjects = []
                for (const subject of book.subjects){
                    const resps = await parseSubject(subject)
                    if(typeof resps !== 'string') for(const resp of resps) subjects.push(resp)
                    else subjects.push(resps)
                }
                if(subjects[0]) id_genre.push(await getGenreOrSave(subjects[0]))
                book.genre = ObjectId(id_genre[0])
                book.key_words = subjects
                
                const resp = new Book(book)
                await resp.save()
                console.log('OK')
                return res.status(200).json(resp)
            }else {
                console.log('Sem sinopse :(')
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
    getBookByISBN,
}