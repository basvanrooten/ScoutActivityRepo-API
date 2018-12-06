let routes = require('express').Router()
const ComponentController = require('../controllers/component_controller');

routes.post('/component', ComponentController.createComponent);
routes.get('/component', ComponentController.getAllComponents);
routes.get('/component/:componentID', ComponentController.getComponentByID);
module.exports = routes;