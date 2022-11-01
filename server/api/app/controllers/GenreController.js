const Genre = require("../models/Genre");
const fs = require('fs');

register('/home/giulia/Documentos/Liber/scripts/genres.txt')
async function register(pathFile){
    try {
        const rawdata = fs.readFileSync(pathFile);
        const genres = JSON.parse(rawdata);
        for(const genre of genres){
            // const userSave = new User(user)
            // const resp = await userSave.save()
            console.log(genre)
        } 
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    register
} ;