'use strict';

const request = require('superagent');
//const debug = require('debug')('instaclone:pic-test');
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
  image: `${__dirname}/../data/tester.jpg`,
};

describe('Pic Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  afterEach( done => {
    Promise.all([
      Pic.remove({}),
      User.remove({}),
      Gallery.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  describe('POST: /api/gallery/galleryId/pic', function() {
    describe('with a valid token and valid data', function() {
      beforeEach( done => {
        new User(exampleUser)
          .generatePasswordHash(exampleUser.password)
          .then( user => user.save())
          .then( user => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then( token => {
            this.tempToken = token;
            done();
          })
          .catch(done);
      });
      beforeEach( done => {
        exampleGallery.userID = this.tempUser._id.toString();
        new Gallery(exampleGallery).save()
          .then( gallery => {
            this.tempGallery = gallery;
            done();
          })
          .catch(done);
      });
      afterEach( done => {
        delete exampleGallery.userID;
        done();
      });
      it('should reurn an object containing url', done => {
        request.post(`${url}/api/gallery/${this.tempGallery._id}/pic`)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .field('name', examplePic.name)
          .field('desc', examplePic.desc)
          .attach('image', examplePic.image)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual(examplePic.name);
            expect(res.body.desc).toEqual(examplePic.desc);
            expect(res.body.galleryID).toEqual(this.tempGallery._id.toString());
            done();
          });
      });
    });
  });
});
            