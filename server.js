const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const app = express();
const port = 3000;

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: 'your_mysql_password',
  database: 'your_database_name'
});