let routes = require('express').Router()
const ActivityController = require('../controllers/activity_controller');

routes.post('/activity', ActivityController.createActivity);
routes.get('/activity', ActivityController.getAllActivities);
routes.get('/activity/:activityID', ActivityController.getActivityByID);
routes.put('/activity/:activityID/component/:componentID', ActivityController.addComponentToActivity);
routes.delete('/activity/:activityID', ActivityController.deleteActivityByID);
routes.delete('/activity/:activityID/component/:componentID', ActivityController.deleteComponentFromActivityByID);

module.exports = routes;