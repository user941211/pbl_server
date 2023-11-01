const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(`요청: ${req.method} ${req.url}`);
    next();
});

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'E:/testfile'); 
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    })
});

app.post('/upload', upload.single('fileToUpload'), (req, res) => {
    res.status(200).send({"message" : "파일 업로드 성공!"});
});

app.get('/', (req, res) => {
	res.send('Hello, World!');
});

app.get('/view/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public', filename); // public 디렉토리 내에서 파일 찾기

    if (fs.existsSync(filePath)) {
        const contentType = getContentType(filePath);
        res.setHeader('Content-Type', contentType);
        res.sendFile(filePath);
    } else {
        res.status(404).send('파일을 찾을 수 없습니다.');
    }
});

// MIME 유형 결정 함수
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.pdf':
            return 'application/pdf';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
}

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
