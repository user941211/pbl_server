const db = require('../config/database');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

exports.uploadFile = upload.single('avatar');

exports.saveFileToDb = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json('파일이 업로드되지 않았습니다.');
    }

    const sql = 'INSERT INTO files (filename, path) VALUES (?, ?)';
    db.query(sql, [file.filename, file.path], (err, result) => {
        if (err) {
            console.error('MySQL query error:', err);
            return res.status(500).json('데이터베이스 오류');
        }
        console.log('File saved to database:', result);
        res.status(201).json('파일 업로드 및 데이터베이스 저장 성공!');
    });
};