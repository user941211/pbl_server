const express = require('express');
const cors = require('cors');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');


const app = express();
const port = 5757;

app.use(cors());
app.use(express.json());

//세션용도
app.use(session({
    secret: process.env.SESSION_SECRET_KEY, // 세션에 대한 시크릿 키
    resave: false,
    saveUninitialized: true
}));

app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`서버가 ${port}포트에서 실행 중입니다.`);
});