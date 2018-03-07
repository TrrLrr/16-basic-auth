'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('instaclone:gallery-router');

const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth.js');

const galleryRouter = module.exports = Router();

galleryRouter.post('/api/gallery', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/gallery');

  req.body.userID = req.user._id;
  new Gallery(req.body).save()
    .then( gallery => res.json(gallery))
    .catch(next);
});


galleryRouter.get('/api/gallery/:galleryId', bearerAuth, function(req, res, next) {
  debug('GET: /api/gallery/:galleryId');

  Gallery.findById(req.params.galleryId)
    .then( gallery => res.json(gallery))
    .catch(next);
});

galleryRouter.put('/api/gallery/:galleryId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/gallery/:galleryId');

  if(!req.body.name) return next(createError(400, 'bad request'));
  if(!req.body.desc) return next(createError(400, 'bad request'));

  Gallery.findByIdAndUpdate(req.params.galleryId, req.body, { new: true })
    .then( gallery => res.json(gallery))
    .catch(next);
});

