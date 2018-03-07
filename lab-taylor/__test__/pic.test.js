'use strict';

const request = require('superagent');
const debug = require('debug')('instaclone:pic-test');
const server = require('../server.js');
const serverToggle = require('../lib/server-toggle.js');

const Pic = require('../model/pic.js');
const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');

require('jest');

const url = 'http://localhost:3000';

const exampleUser = {
  username: 'Teacup Timmy',
  password: '1234',
  email: 'teacuptimmy@test.com',
};

const exampleGallery = {
  name: 'exampleGallery',
  desc: 'some description',
};

const examplePic = {
  name: 'test pic',
  desc: 'test pic desc',
  image: `${__dirname}/../data/tester.png`,
};