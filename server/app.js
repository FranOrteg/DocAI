//.env
require('dotenv').config();


const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const allowedOrigins = ['http://localhost:4200']; // Cambia esto si tu frontend tiene otro puerto

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(logger('dev'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api', require('./routes/api'));

module.exports = app;
