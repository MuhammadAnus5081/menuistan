const express = require('express');
const router = express.Router();
const controller = require('../controller/file.controller');

router.post('/upload', controller.uploadFiles);
router.get('/files', controller.getListFiles);
router.get('/files/:name', controller.download);
router.delete('/files/:name', controller.remove);

module.exports = router;
