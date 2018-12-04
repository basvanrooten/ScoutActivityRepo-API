let routes = require('express').Router()
const UserController = require('../controllers/user_controller');

routes.post('/login', UserController.login);
routes.post('/register', UserController.register);

module.exports = routes;