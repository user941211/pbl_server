const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
require("dotenv").config();
const cors = require('cors');

const app = express();
const port = 5757;
app.use(cors());
app.use(express.json());

// MySQL db 설정입니다. 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
app.get('/test', (req, res) =>{
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            
            console.error('MySQL query error:', err);
            return res.status(500).json('데이터베이스 오류');
        }
        console.log(results)
        // 결과를 클라이언트로 보냅니다.
        res.json(results);
    });
})

app.post('/login', async (req, res) => {
    //console.log(req)
    console.log(req.body)//이걸로 성공
    console.log(req.params)//이거는 어떤거였더라..
    const username = req.body.id;
    const password = req.body.pw;

    // 프리페어드 스테이트먼트를 사용하여 SQL 인젝션 방지
    const sql = 'SELECT * FROM users WHERE id = ? AND pw = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('MySQL query error:', err);
            return res.send('로그인 실패!');
        }

        if (results.length > 0) {
            res.status(200).send('로그인 성공!');
        } else {
            res.status(400).send('로그인 실패!');
        }
    });
});

app.listen(port, () => {
    console.log(`서버가 ${port}포트 에서 실행 중입니다.`);
});