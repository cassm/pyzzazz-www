const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { stderrStream, stdoutStream } = require('./utils/logger/morgan');

const indexRouter = require('../routes');
const usersRouter = require('../routes/users');
const resourceRouter = require('../routes/resource');
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
app.use('/resource', resourceRouter);
app.use(express.static('public'));
app.use('/dist', express.static('client/dist', ))

module.exports = app;
