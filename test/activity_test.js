//
// Activity tests
//

// Due to time constraints, here's a hardcoded token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzA2YTM3MzQxZmVlZjY0NDA1NTNkY2IiLCJlbWFpbCI6ImJhc3ZhbnJvb3RlbkBtZS5jb20iLCJmaXJzdE5hbWUiOiJCYXMiLCJsYXN0TmFtZSI6InZhbiBSb290ZW4iLCJwZXJtaXNzaW9ucyI6MCwiaWF0IjoxNTQ0NjQ3ODIwLCJleHAiOjE1NDcyMzk4MjB9._va33xz7DiM9Dv_CrfKxpPc6EioPXzqK9M8hGRV2C_M";

const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Activity = mongoose.model('activity');

describe('Testing the activity controller', function() {

    it('saves an activity to the database', (done) => {
        // Post new activity
        Activity.countDocuments().then(count => {
            request(app)
            .post('/api/activity/')
            .set('Authorization', 'Bearer ' + token)
            .send({
              "name": "Unit tests Component test",
              "date": Date.now(),
              "expressionField": "Unit Tests",
              "author": "5c06a37341feef6440553dcb"
            })
            .end((err, res) => {
                Activity.countDocuments().then(newCount => {
                    Activity.findByIdAndDelete(res.body._id).then(() => {
                        // Check if server returns status 200
                        assert(count + 1 === newCount);
                        assert(res.statusCode === 200);
                        done();
                    });
                });
            });
        });
    });

    it('should throw an error when adding activity with invalid name', (done) => {
        // Post new activity
        Activity.countDocuments().then(count => {
            request(app)
            .post('/api/activity/')
            .set('Authorization', 'Bearer ' + token)
            .send({
              "name": "UT",
              "date": Date.now(),
              "expressionField": "Unit Tests",
              "author": "5c06a37341feef6440553dcb"
            })
            .end((err, res) => {
                Activity.countDocuments().then(newCount => {
                    Activity.findByIdAndDelete(res.body._id).then(() => {
                        // Check if server returns status 412
                        assert(count === newCount);
                        assert(res.statusCode === 412);
                        done();
                    });
                });
            });
        });
    });


});