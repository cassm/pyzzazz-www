const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { stderrStream, stdoutStream } = require('./utils/logger/morgan');

const indexRouter = require('../routes');
const usersRouter = require('../routes/users');
const ledsRouter = require('../routes/leds');
const redis = require("./db/redis");

const app = express();

// connect redis client
const r = redis.client.getInstance();
r.connect();

// Morgan logger
app.use(stderrStream, stdoutStream);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/leds', ledsRouter);
app.use(express.static('public'));
app.use('/dist', express.static('client/dist', ))

module.exports = app;
