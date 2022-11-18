const multer = require('multer')

module.exports = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => { cb(null, './images/books') },
        filename: (req, file, cb) => { 
            const { isbn } = req.params
            cb(null, isbn + '.' + file.mimetype.replace('image/', '') ) 
        },
    }),
    fileFilter: (req, file, cb) => { 
        const imgEx =  ['image/png', 'image/jpg', 'image/jpeg'].find((accepted => accepted === file.mimetype ))
        if(imgEx) return cb(null, true) 
        return cb(null, false) 
    }, 
})) 