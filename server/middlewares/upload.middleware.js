import multer from "multer";
import fs from "fs";
import path from "path";

// Memory storage (CSV/Excel imports)
export const memoryUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});

// Disk storage (photos)
const uploadPath = "uploads/visitor_photos";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(null, uniqueName + path.extname(file.originalname));
    },
});

export const diskUpload = multer({
    storage: diskStorage,
    limits: {
        fileSize: 50 * 1024 * 1024,
    },
});