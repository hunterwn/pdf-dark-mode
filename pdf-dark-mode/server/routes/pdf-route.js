// /pdf route

const express = require('express');
const downloadController = require('../controllers/download-controller.js');
const processController = require('../controllers/process-controller.js');

const router = express.Router();

router.post('/', processController.pdfPost);
router.get('/', downloadController.pdfGet);

module.exports = router;