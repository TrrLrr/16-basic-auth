'use strict';

const Router = require('express').Router;

const welcomeRouter = module.exports = Router();


welcomeRouter.get('/', function(req, res, next) {

  res.send('Welcome to the Instaclone backend!!!')
    .catch(next);

});