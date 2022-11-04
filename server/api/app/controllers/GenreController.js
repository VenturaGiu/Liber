const Genre = require("../models/Genre");
const fs = require('fs');

/*
    𝗙𝗨𝗡𝗖̧𝗢̃𝗘𝗦
*/

async function createTag(name) {
    const tag = name.toLowerCase().replaceAll(' ', '_').replaceAll('-', '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return tag
}

// registera('/home/giulia/Documentos/liber/scripts/genres.json')
/**  Listar todos os usuário cadastrados
 * @author Giulia Ventura
 * @date 02/11/2022
 * @param {String} pathFile caminho absoluto do arquivo JSON
 */
async function register(pathFile){
    try {
        const rawdata = fs.readFileSync(pathFile);
        const genres = JSON.parse(rawdata);
        for(const genre of genres){
            const exist = await Genre.findOne(genre)
            if(!exist){
                const tag = createTag(genre.name)
                genre.tag = tag
                const genreSave = new Genre(genre)
                await genreSave.save()            
            } 
        }
    } catch (error) {
        console.log(error)
    }
}

/*
    𝘼𝙋𝙄
*/

async function getGenreByTag(req, res) {
    try {
        const { tag } = req.params;
        const genre = await Genre.findOne({ tag })
        if (!genre) return res.status(461).json({ message: 'Gênero não encontrado!' })
        return res.status(200).json(genre)
    } catch (error) {
        return res.status(500).json(error)
    }
}

async function saveGenreByName(req, res) {
    try {
        const { name } = req.params;
        const tag = await createTag(name)
        const genre = new Genre({ name, tag })
        await genre.save()
        return res.status(200).json(genre)
    } catch (error) {
        return res.status(500).json(error)
    }
    
}

module.exports = {
    register,
    saveGenreByName,
    getGenreByTag,
    createTag,
} ;