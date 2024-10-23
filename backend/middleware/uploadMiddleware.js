import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
    file.mimetype === 'application/pdf' ? cb(null, true) : cb(new Error('Only PDFs allowed'), false);
};

export default multer({ storage, fileFilter });