const db = require('../config/database');
const multer = require('multer');
const fs = require('fs');
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

exports.sendFile = (req, res) => {
    const { filename } = req.params;

    // uploads 폴더에서 파일 검색
    const filePath = path.join(__dirname, '../uploads', filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // 파일이 존재하지 않으면 404 에러 반환
            return res.status(404).json('파일을 찾을 수 없습니다.');
        }

        // 파일을 클라이언트에게 전송
        res.sendFile(filePath);
    });
};