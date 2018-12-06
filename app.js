
// Node dependancies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require("morgan");
const logger = require('./config/config').logger
const config = require('./config/config');

// Import models
const ApiResponse = require('./models/ApiReponse');

// Import routes
const user_routes = require('./routes/user_routes');
const component_routes = require('./routes/component_routes');

const app = express();

// If environment is not test, then connect to production hosted mongo server
if (process.env.NODE_ENV !== 'test') {
    console.log("Connecting to production database....");
    mongoose.connect(config.mongoURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false});
};

// Check the connection. Output error if something's wrong
const connection = mongoose.connection
.once('open', () =>{ 
	console.info(`Connected to MongoDB!`);
})
.on('error', (error) =>{
	logger.error(error.toString());
});

// Parse the request body to JSON
app.use(bodyParser.json());

// Setup Morgan as Logger
app.use(morgan("dev"));

// Routes
app.use('/api', user_routes);
app.use('/api', component_routes);

app.get('/', function(req, res, next) {
    res.status(200).send(new ApiResponse("Hello World!", 200));
});


//This endpoint is called when no other one was found, and throws a 404 error
app.use('*', function(req, res, next){
    res.status(404).send(new ApiResponse("This endpoint doesnt't exist", 404));
});

// Export class for test cases
module.exports = app;