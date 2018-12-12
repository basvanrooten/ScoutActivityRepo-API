//
// User tests
//

// Test dependancies
const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = mongoose.model('user');

describe('Testing the user controller', function() {
    this.timeout(6000);

    it('saves an user to the database', (done) => {
        // Post new user
        User.countDocuments().then(count => {
            request(app)
            .post('/api/register/')
            .send({
              "email": "test@unittests.com",
              "firstName": "non",
              "lastName": "existent",
              "password": "test123456789",
              "passwordConfirm": "test123456789"
            })
            .end((err, res) => {
                User.countDocuments().then(newCount => {
                    User.findByIdAndDelete(res.body._id).then(() => {
                        // Check if server returns status 200
                        assert(count + 1 === newCount);
                        assert(res.statusCode === 200);
                        done();
                    });
                });
            });
        });
    });

    it('should throw error when user already exists', (done) => {
        // Post new user
        User.countDocuments().then(count => {
            request(app)
            .post('/api/register/')
            .send({
              "email": "test@unittests.com",
              "firstName": "non",
              "lastName": "existent",
              "password": "test123456789",
              "passwordConfirm": "test123456789"
            })
            .end((err, res) => {

                request(app)
                .post('/api/register/')
                .send({
                  "email": "test@unittests.com",
                  "firstName": "non",
                  "lastName": "existent",
                  "password": "test123456789",
                  "passwordConfirm": "test123456789"
                })
                .end((err, res2) => {
                    User.countDocuments().then(newCount => {
                        User.findByIdAndDelete(res.body._id).then(() => {
                            // Check if server returns status 200
                            assert(count + 1 === newCount);
                            assert(res2.statusCode === 409);
                            done();
                        });
                    });
                })
            });
        });
    });

    it('should return token when trying to login with valid credentials', (done) => {
        // Post new user
        User.countDocuments().then(count => {
            request(app)
            .post('/api/register/')
            .send({
              "email": "test@unittests.com",
              "firstName": "non",
              "lastName": "existent",
              "password": "test123456789",
              "passwordConfirm": "test123456789"
            })
            .end((err, res) => {
                User.countDocuments().then(newCount => {
                    request(app)
                    .post('/api/login/')
                    .send({
                      "email": "test@unittests.com",
                      "password": "test123456789"
                    }).end((err, res2) => {
                        User.findByIdAndDelete(res.body._id).then(() => {
                            // Check if server returns status 200
                            assert(res2.body.token);
                            assert(res2.statusCode === 200);
                            assert(count + 1 === newCount);
                            assert(res.statusCode === 200);
                            done();
                        });
                    });
                });
            });
        });
    });

    it('should return error when trying to login with invalid credentials', (done) => {
        // Post new user
        User.countDocuments().then(count => {
            request(app)
            .post('/api/register/')
            .send({
              "email": "test@unittests.com",
              "firstName": "non",
              "lastName": "existent",
              "password": "test123456789",
              "passwordConfirm": "test123456789"
            })
            .end((err, res) => {
                User.countDocuments().then(newCount => {
                    request(app)
                    .post('/api/login/')
                    .send({
                      "email": "test@unittests.com",
                      "password": "invalidPassword"
                    }).end((err, res2) => {
                        User.findByIdAndDelete(res.body._id).then(() => {
                            // Check if server returns status 200
                            assert(res2.body.message === "Inloggegevens niet gevonden");
                            assert(res2.statusCode === 401);
                            assert(count + 1 === newCount);
                            assert(res.statusCode === 200);
                            done();
                        });
                    });
                });
            });
        });
    });
});