const db = require('../config/database');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 업로드 폴더에 저장하는걸로 임시로 정함
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const passwordPattern = /^(?=.*\d)(?=.*[a-zA-Z]).{8,15}$/;
//위는 정규식이다. 영어 대소문자, 숫자를 포함해서 8자리에서 15자리 사이여야하고
//이걸 프론트에서도 똑같이 적용해서 이중으로 확인해보자!

exports.getUsers = (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('MySQL query error:', err);
            return res.status(500).json('데이터베이스 오류');
        }
        console.log(results);
        res.json(results);
    });
};

exports.createUser = (req, res) => {
    const { id, pw } = req.body;

    // 비밀번호 형식 검증
    if (!passwordPattern.test(pw)) {
        return res.status(400).json('비밀번호는 최소 8자리 이상 15자리 이하, 영문과 숫자를 포함해야 합니다.');
    }

    const sql = 'INSERT INTO users (id, pw) VALUES (?, ?)';
    db.query(sql, [id, pw], (err, result) => {
        if (err) {
            console.error('MySQL query error:', err);
            return res.status(500).json('데이터베이스 오류');
        }
        console.log('User created:', result);
        res.status(201).json('회원가입 성공!');
    });
};

exports.loginUser = (req, res) => {
    const { id, pw } = req.body;
    console.log(req.body)
    const sql = 'SELECT * FROM users WHERE id = ? AND pw = ?';
    db.query(sql, [id, pw], (err, results) => {
        if (err) {
            console.error('MySQL query error:', err);
            return res.status(500).json('데이터베이스 오류');
        }

        if (results.length > 0) {
            req.session.user = {
                id: results[0].id,
                name: results[0].name,
                
            };
            res.status(200).json('로그인 성공!');
        } else {
            res.status(400).json('로그인 실패!');
        }
    });
};

exports.logoutUser = (req, res) => {
    // 세션 제거
    req.session.destroy((err) => {
        if (err) {
            console.error('세션 제거 오류:', err);
            return res.status(500).json('세션 제거 오류');
        }
        res.status(200).json('로그아웃 성공!');
    });
};

//이 위는 유저 관련 파일이다.

exports.uploadFile = upload.single('avatar');

exports.saveFileToDb = (req, res) => {
    // 파일 정보는 req.file에서 얻을 수 있습니다.
    const file = req.file;
    if (!file) {
        return res.status(400).json('파일이 업로드되지 않았습니다.');
    }

    // 데이터베이스에 파일 정보 저장
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

//이 코드는 파일을 db에 저장하는 코드이다.