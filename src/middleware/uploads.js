const multer = require('multer');
const uuid = require('uuid');
const maxSize = 30 * 1024 * 1024; // Maximum file size

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './resources/static/assets/uploads/'); // Set your destination directory here
  },
  filename: (req, file, cb) => {
    const userId = req.body.userId || 'defaultUserId'; // Fallback if userId is not provided
    const jobId = req.body.jobId || 'defaultJobId'; // Fallback if jobId is not provided
    const uniqueId = uuid.v4(); // Generate a unique identifier

    // Construct the filename with userId, jobId, and a unique identifier
    const fileName = `${userId}_${jobId}_${uniqueId}_${file.originalname}`;
    
    cb(null, fileName); // Use the constructed filename
  },
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array('imageFiles', 1); // Assuming you want to handle an array of image files

module.exports = uploadFile;
