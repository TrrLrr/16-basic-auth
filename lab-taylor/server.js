'use strict';

const express = require('express');
const debug = require('debug')('instaclone:server');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/user-router.js');
const errors = require('./lib/err-middleware.js');

dotenv.load();

const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(userRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`Server listening on ${PORT}`);
});

server.isRunning = true;