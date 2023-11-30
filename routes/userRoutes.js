const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const dbController = require('../controllers/dbController');
const dbRoutes = require('./dbRoutes');

router.get('/test', userController.getUsers);
router.post('/login', userController.loginUser);
router.post('/signup', userController.createUser);
router.post('/logout', userController.logoutUser);
router.post('/upload', dbController.uploadFile, dbController.saveFileToDb);

router.use('/db', dbRoutes);
//이건 db에서 보내는 용도

module.exports = router;