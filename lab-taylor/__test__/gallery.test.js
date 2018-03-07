'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

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

const galleryUpdate = {
  name: 'update gallery',
  desc: 'update description',
};

describe('Gallery Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  afterEach( done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  describe('POST: /api/gallery', () => {
    describe('with a valid body', () => {
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
      it('should return a gallery', done => {
        request.post(`${url}/api/gallery`)
          .send(exampleGallery)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.desc).toEqual(exampleGallery.desc);
            expect(res.body.name).toEqual(exampleGallery.name);
            expect(res.body.userID).toEqual(this.tempUser._id.toString());
            done();
          });
      });
      describe('without a token', () => {
        it('should return a 401', done => {
          request.post(`${url}/api/gallery`)
            .send(exampleGallery)
            .set({
              Authorization: ``,
            })
            .end((err, res) => {
              expect(res.status).toEqual(401);
              expect(err.message).toEqual('Unauthorized');
              done();
            });
        });
      });
      describe('with an invalid body', () => {
        it('should return a 400 status', done => {
          request.post(`${url}/api/gallery`)
            .send({})
            .set({
              Authorization: `Bearer ${this.tempToken}`,
            })
            .end((err, res) => {
              expect(res.status).toEqual(400);
              expect(err.message).toEqual('Bad Request');
              done();
            });
        });
      });
    });
  });
  describe('GET: /api/gallery/:galleryId', () => {
    describe('with a valid token/endpoint', () => {
      beforeEach( done => {
        new User(exampleUser)
          .generatePasswordHash(exampleUser.password)
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

      afterEach( () => {
        delete exampleGallery.userID;
      });

      it('should return a gallery', done => {
        request.get(`${url}/api/gallery/${this.tempGallery._id}`)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual(exampleGallery.name);
            expect(res.body.desc).toEqual(exampleGallery.desc);
            expect(res.body.userID).toEqual(this.tempUser._id.toString());
            done();
          });
      });
    });
    describe('with an invalid token', () => {
      it('should return a 401 status', done => {
        request.get(`${url}/api/gallery/${this.tempGallery._id}`)
          .set({
            Authorization: ``,
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(err.message).toEqual('Unauthorized');
            done();
          });
      });
    });
    describe('with an invalid endpoint', () => {
      it('should return a 404 status', done => {
        request.get(`${url}/api/gallery/`)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(err.message).toEqual('Not Found');
            done();
          });
      });
    });
  });
  describe('PUT: /api/gallery/galleryId', () => {
    describe('with a valid token and id', () => {
      beforeEach( done => {
        new User(exampleUser)
          .generatePasswordHash(exampleUser.password)
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

      afterEach( () => {
        delete exampleGallery.userID;
      });
      it('should update a gallery', done => {
        request.put(`${url}/api/gallery/${this.tempGallery._id}`)
          .send(galleryUpdate)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual(galleryUpdate.name);
            expect(res.body.desc).toEqual(galleryUpdate.desc);
            expect(res.body.userID).toEqual(this.tempUser._id.toString());
            done();
          });
      });
    });
    describe('without a valid token', () => {
      beforeEach( done => {
        new User(exampleUser)
          .generatePasswordHash(exampleUser.password)
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

      afterEach( () => {
        delete exampleGallery.userID;
      });
      it('should return a 401 status', done => {
        request.put(`${url}/api/gallery/${this.tempGallery._id}`)
          .send(galleryUpdate)
          .set({
            Authorization: ``,
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(err.message).toEqual('Unauthorized');
            done();
          });
      });
      it('should return a 400 status', done => {
        request.put(`${url}/api/gallery/${this.tempGallery._id}`)
          .send({})
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
      
    });
    describe('without valid endpoint', () => {
      it('should return a 404 status', done => {
        request.put(`${url}/api/gallery/`)
          .send(exampleGallery)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(err.message).toEqual('Not Found');
            done();
          });
      });
    });
  });
  describe('DELETE: /api/gallery/galleryid', () => {
    beforeEach( done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
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

    afterEach( () => {
      delete exampleGallery.userID;
    });
    describe('with a valid endpoint', () => {

      it('should delete a gallery', done => {
        request.delete(`${url}/api/gallery/${this.tempGallery._id}`)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(204);
            done();
          });
      });
    });
    describe('with an invalid endpoint', () =>{
      it('should return a 404 status', done => {
        request.delete(`${url}/api/gallery/`)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(err.message).toEqual('Not Found');
            done();
          });
      });
    });
    describe('with no token', () => {
      it('should return a 401 status', done => {
        request.delete(`${url}/api/gallery/${this.tempGallery._id}`)
          .set({
            Authorization: ``,
          })
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(err.message).toEqual('Unauthorized');
            done();
          });
      });
    });
  });
});

            
