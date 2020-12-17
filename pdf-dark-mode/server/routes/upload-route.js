// /upload route

const express = require('express');
const uploadController = require('../controllers/upload-controller.js');

const router = express.Router();

router.post('/', uploadController.pdfPost);

module.exports = router;