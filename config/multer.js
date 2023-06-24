const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/avatars")
    },
    filename: (req, file, cb) => {
        const newFileName = (new Date().toISOString() + file.originalname).replace(/[^a-zA-Z0-9]/g, '.')
        cb(null, newFileName);
        req.filename = newFileName;
    }
})

const upload = multer ({
    storage: storage,
})

module.exports = upload;