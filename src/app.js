const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { stderrStream, stdoutStream } = require('./utils/logger/morgan');

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

app.use(express.static(path.join(__dirname, '../', 'react-client', 'build')));
app.use('/resource', resourceRouter);

// pass everything that isn't a static file request or an api request to react for routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'react-client', 'build', 'index.html'));
})

module.exports = app;
