const User = require('../models/UserModel');
const uploadFileMiddleware = require("../middleware/upload");
const fs = require("fs");
const path = require('path');
const baseUrl = "/files/";
const uuid = require('uuid');

// Define __basedir as the absolute path to your project's root directory
global.__basedir = path.resolve(__dirname, '..', '..'); // Go up two levels from the current directory

const uploadFiles = (req, res) => {
  uploadFileMiddleware(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'File upload failed.' });
    }

    // Handle file uploads here
    const userId = req.body.userId;
    const jobId = req.body.jobId;
    const files = req.files; // Array of uploaded files

    //
    //const uploadId = uuid.v4(); // Generate a random UUID
    
    const fileInfos = [];

    // Loop through the uploaded files and process them
    files.forEach((file) => {
      // Generate a unique ID for each file
      const fileId = uuid.v4();

      const fileName = `${userId}_${jobId}_${fileId}_${file.originalname}`;
      // Handle the file as needed (e.g., save it, update the database, etc.)
      // ...

      // Store file information including the generated fileId
      fileInfos.push({
        fileId: fileId,
        fileName: fileName,
      });
    });

    res.status(200).send({
      message: 'Uploaded files successfully!',
      files: fileInfos, // Return an array of file information including the fileId
    });
  });
};

const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      const imageUrl = baseUrl + file;

      // Extract userId, jobId, riggerId, and transId from the file name
      const [userId, jobId, fileId, originalFileName] = file.split('_'); // Add 'fileId' here
      const riggerId = req.body.riggerId || 'nil';
      const transId = req.body.transId || 'nil';

      fileInfos.push({
        fileId: fileId, // Include the fileId in the response
        fileName: file,
        url: imageUrl,
        viewUrl: `https://${req.get('host')}${imageUrl}`,
        userId,
        jobId,
        riggerId,
        transId,
      });
    });

    res.status(200).send(fileInfos);
  });
};
const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const remove = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      return res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }

    res.status(200).send({
      message: "File is deleted.",
    });
  });
};

const removeSync = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  try {
    fs.unlinkSync(directoryPath + fileName);
    res.status(200).send({
      message: "File is deleted.",
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
};


module.exports = {
  uploadFiles,
  getListFiles,
  download,
  remove,
  removeSync,
};
