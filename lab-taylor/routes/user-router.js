'use strict';

const jsonParser =  require('body-parser').json();
const debug = require('debug')('instaclone:user-router');
const createError = require('http-errors');
const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');

const userRouter = module.exports = Router();

userRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST: /api/signup');

  if(!req.body.username || !req.body.email) { 
    return next(createError(400, 'bad request'));
  }

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);
  user.generatePasswordHash(password)
    .then( user => user.save())
    .then( user => user.generateToken())
    .then( token => res.send(token))
    .catch(next);
});

userRouter.get('/api/login', basicAuth, function(req, res, next) {
  debug('GET: /api/login');

  User.findOne({ username: req.auth.username })
    .then( user => user.comparePasswordHash(req.auth.password))
    .then( user => user.generateToken())
    .then( token => res.send(token))
    .catch(next);
});
     