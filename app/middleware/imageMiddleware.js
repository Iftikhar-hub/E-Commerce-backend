
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')

    },
    filename: (req, file, cb) => {
        const newFilename = Date.now() + path.extname(file.originalname)
        cb(null, newFilename)

    }

})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    }
});

module.exports = { upload };