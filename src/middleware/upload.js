const multer = require('multer');
const uuid = require('uuid');
const maxSize = 30 * 1024 * 1024; // Maximum file size

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'resources/static/assets/uploads');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext) + '-' + Date.now() + ext;
    cb(null, filename);
  }
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array('imageFiles', 1); // Assuming you want to handle an array of image files

module.exports = uploadFile;
