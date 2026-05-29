import fs from "fs"
import path from "path";
import multer from "multer";

const uploadPath = 'uploads/visitor_photos';

// create folder if not exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// storage config
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1E9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    }
});

// multer config
const upload = multer({

    storage,

    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
    }

});

module.exports = upload;