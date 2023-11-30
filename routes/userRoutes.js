const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/test', userController.getUsers);
router.post('/login', userController.loginUser);
router.post('/signup', userController.createUser);
router.post('/logout', userController.logoutUser);
router.post('/upload', userController.uploadFile, userController.saveFileToDb);

module.exports = router;