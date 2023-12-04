const db = require('../config/database');

const passwordPattern = /^(?=.*\d)(?=.*[a-zA-Z]).{8,15}$/;
//위는 정규식이다. 영어 대소문자, 숫자를 포함해서 8자리에서 15자리 사이여야하고
//이걸 프론트에서도 똑같이 적용해서 이중으로 확인해보자!

exports.tests = (req, res) => {
    const sql = 'SELECT * FROM checks';
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

exports.bletest = (req, res) => {
    // 세션 제거
    const sql='SELECT * from checks'
    db.query(sql, (err, result) => {
        if(result.length > 0){
            res.status(200).json('서버 및 db 연결 성공!')
        } else {
            res.status(400).json('서버는 연결했으나 db는 연결 불가..')
        }
    })
};