'use strict';

const request = require('superagent');
const User = require('../model/user.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

require('jest');

const url = `http://localhost:${PORT}`;

const exampleUser = {
  username: 'exampleUser',
  password: '1234',
  email: 'exampleUser@test.com',
};

describe('User Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/signup', function() {
    describe('with a valid body', function() {
      afterEach( done => {
        User.remove({})
          .then( () => done())
          .catch(done);
      });

      it('should return a token', done => {
        request.post(`${url}/api/signup`)
          .send(exampleUser)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.text).toEqual('string');
            done();
          });
      });
    });
    describe('with an invalid body', function() {
      it('should return a 400 status', done => {
        request.post(`${url}/api/signup`)
          .send({})
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
  });
  describe('GET: /api/login', function() {
    describe('with a valid body', function() {
      beforeEach( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
          .then( user => user.save())
          .then( user => {
            this.tempUser = user;
            done();
          })
          .catch(done);
      });
      
      afterEach( done => {
        User.remove({})
          .then( () => done())
          .catch(done);
      });
      
      it('should return a token', done => {
        request.get(`${url}/api/login`)
          .auth('exampleUser', '1234')
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(typeof res.text).toEqual('string');
            done();
          });
      });
    });
    describe('with missing body', function() {
      it('should return a 401 status', done => {
        request.get(`${url}/api/login`)
          .auth('', '')
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
    });
    describe('with invalid password', function() {
      beforeEach( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
          .then( user => user.save())
          .then( user => {
            this.tempUser = user;
            done();
          })
          .catch(done);
      });
      
      afterEach( done => {
        User.remove({})
          .then( () => done())
          .catch(done);
      });
      it('should return a 401 status', done => {
        request.get(`${url}/api/login`)
          .auth('exampleUser', '4321')
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(err.message).toEqual('Unauthorized');
            done();
          });
      });
    });
  });
});
            
              

            

    
    

            

