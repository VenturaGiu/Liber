const fetch = require('node-fetch');

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

async function subject(subject) {
    return subject === 'ficction' ? 'ficção'
}

async function getBookByISBN(req, res) {
    try {
        const { isbn } = req.params
        const response = await fetch(`https://brasilapi.com.br/api/isbn/v1/${isbn}`);
        const book = await response.json()
        if(book.message === 'ISBN inválido') return res.status(200).json({ message: 'ISBN inválido '})
        return res.status(200).json(book)
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