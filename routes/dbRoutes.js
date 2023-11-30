const express = require('express');
const router = express.Router();
const dbController = require('../controllers/dbController');

router.get('/file/:filename', dbController.sendFile);

module.exports = router;