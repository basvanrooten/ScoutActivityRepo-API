const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const mongoose = require('mongoose');
const ApiResponse = require('./models/ApiReponse');

const app = express();

// Parse the request body to JSON
app.use(bodyParser.json());

// Setup Morgan as Logger
app.use(morgan("dev"));

// Start routes
app.get('/', function(req, res, next) {
    res.status(200).send(new ApiResponse("Hello World!", 200));
});


//This endpoint is called when no other one was found, and throws a 404 error
app.use('*', function(req, res, next){
    res.status(404).send(new ApiResponse("This endpoint doesnt't exist", 404));
});

module.exports = app;