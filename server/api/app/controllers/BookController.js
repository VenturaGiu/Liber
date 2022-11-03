const fetch = require('node-fetch');
const Genre = require('../models/Genre')

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

async function generateBookDefault(objBook) {
    const authors = [] 
    objBook.contribuicao.forEach(con => {
        authors.push(con.tipo_de_contribuicao === 'Autor' ? `${con.nome} ${con.sobrenome}`: next)
    });
    const id_gerne = []
    const genre = await Genre.findOne({ name: objBook.catalogacao.areas })
    console.log(authors)
    const book = {
        title: objBook.titulo,
        isbn: objBook.isbn,
        authors: authors,
        synopsis: objBook.sinopse,
        publisher: objBook.editora.nome_fantasia,
        year: objBook.ano_edicao,
        location: objBook.origem,
        language: objBook.idioma,
        page_count: Number(objBook.medidas.paginas),
        keyword: objBook.catalogacao.palavras_chave.split(', '),
        genre: genre._id,
    }
    return book
}

async function getBookByISBN(req, res) {
    try {
        const { isbn } = req.params
        let response = await fetch(`https://api.mercadoeditorial.org/api/v1.2/book?isbn=${isbn}`);
        let book = await response.json()
        if (book.status.message === "Nenhum registro foi encontrado") {
            response = await fetch(`https://brasilapi.com.br/api/isbn/v1/${isbn}`);
            book = await response.json()
            if(book.message === 'ISBN inválido') return res.status(200).json({ message: 'Não encontramos esse ISBN em nossa base de dados!'})
            return res.status(200).json(book)
        }
        let objBook = await generateBookDefault(book.books[0])
        return res.status(200).json(objBook)
    } catch (error) {
        return res.status(500).json(error)
    }
}

async function registerBook(req, res){
    try {
        const info = req.body
        const subjects_translate = await subject(info.subjects)
        for(const subject of subjects){

        }
    } catch (error) {
        return res.status(500).json(error)
    }
}

module.exports = {
    registerBook,
    getBookByISBN,
}