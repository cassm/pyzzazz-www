const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { stderrStream, stdoutStream } = require('./utils/logger/morgan');

const indexRouter = require('../routes');
const usersRouter = require('../routes/users');

const app = express();

// Morgan logger
app.use(stderrStream, stdoutStream);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;