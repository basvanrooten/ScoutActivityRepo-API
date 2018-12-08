const Activity = require('../models/Activity');
const Component = require('../models/Component');
const ApiResponse = require('../models/ApiReponse');
const UserController = require('../controllers/user_controller');
const assert = require('assert');

// Checking if component with the ID exists or not
function componentExists(id, callback){
    Component.findOne({ _id: id })
        .then((component) => {
            if(component !== null){
                callback(true);
            } else {
                callback(false);
            }
        }).catch(err => {

            // Error searching for ID
            callback(false);
        });
}

module.exports = {

    // CREATE

    // BODY: "name", "date", "expressionField", "author", "components"
    createActivity(req, res, next) {
        const activityProps = req.body;
        let token = req.get('Authorization');

        UserController.authenticate(token, (auth) => {
            // If token is valid, continue
            if (auth) {

                // Assert the incoming properties
                try {
                    assert(typeof (activityProps.name) === "string", "Onderdeelnaam moet een string zijn");
                    assert(typeof (activityProps.expressionField) === "string", "Expressiegebied moet een string zijn");
                    assert(typeof (activityProps.author) === "string", "Author moet een geldig ID zijn");

                } catch (e) {
                    // Catch assertion error
                    res.status(422).send(new ApiResponse(e.message, 422));
                    return;
                }
                // If asserts are ok, check if component name already exists
                Activity.create(activityProps)
                    .then(activity => {
                        res.status(200).send({
                            "_id": activity._id,
                            "name": activity.name,
                            "date": activity.date,
                            "expressionField": activity.expressionField,
                            "author": activity.author,
                            "createdAt": activity.createdAt
                        })
                    })
                    .catch(e => {
                        res.status(412).send(new ApiResponse(e.message, 412));
                        return;
                    });
            } else {
                res.status(401).send(new ApiResponse('Invalid or missing token. Unauthenticated', 401)).end();
            }

        });
    },

    // READ

    getAllActivities(req, res, next) {
        let token = req.get('Authorization');

        UserController.authenticate(token, (auth) => {
            // If token is valid, continue
            if (auth) {
                Activity.find()
                    .then(activity => res.send(activity))
                    .catch(next);
            } else {
                // Invalid token, send 401 response
                res.status(401).send(new ApiResponse('Invalid or missing token. Unauthenticated', 401)).end();
            }

        });
    },

    getActivityByID(req, res, next) {
        let token = req.get('Authorization');
        let params = req.params.activityID;

        UserController.authenticate(token, (auth) => {
            // If token is valid, continue
            if (auth) {
                Activity.findById(params, (err, activity) => {
                    // Check if error occured
                    if (err) {
                        // Error occured
                        res.status(400).send(new ApiResponse(err.message, 400)).end();
                        return;
                    }
                    if (!activity) {
                        // No activity found, returning 404
                        res.status(404).send(new ApiResponse("No activity found with that ID", 404)).end();
                        return;
                    } else {
                        // Activity was found! Returning the activity
                        res.status(200).send(activity).end();
                        return;
                    }
                })

            } else {
                // Invalid token, send 401 response
                res.status(401).send(new ApiResponse('Invalid or missing token. Unauthenticated', 401)).end();
            }
        });
    },

    // UPDATE
    // BODY: "name", "expressionField", "duration", "budget", "componentText"
    addComponentToActivity(req, res, next) {

        let token = req.get('Authorization');
        let activityID = req.params.activityID;
        let componentID = req.params.componentID

        UserController.authenticate(token, (auth) => {
            // If token is valid, continue
            if (auth) {
                Activity.findById(activityID, (err, activity) => {
                    // Check if error occured
                    if (err) {
                        // Error occured
                        res.status(400).send(new ApiResponse(err.message, 400)).end();
                        return;
                    }
                    if (!activity) {
                        // No component found, returning 404
                        res.status(404).send(new ApiResponse("No activity found with that ID", 404)).end();
                        return;
                    } else {
                        componentExists(componentID, (result) => {
                            if (result) {
                                // Component exists! Whoop tee doo
                                // https://stackoverflow.com/questions/18148166/find-document-with-array-that-contains-a-specific-value
                                activity.components.push(componentID);
                                activity.save();
    
                                // Component was edited successfully. Returning the new component
                                res.status(200).send(activity).end();
                                return;
                            } else {
                                // No component found, returning 404
                                res.status(404).send(new ApiResponse("No component found with that ID", 404)).end();
                                return;
                            }
                        });
                    }
                });
            } else {
                // Invalid token, send 401 response
                res.status(401).send(new ApiResponse('Invalid or missing token. Unauthenticated', 401)).end();
            }
        });
    },


    // DELETE
    deleteActivityByID(req, res, next) {
        let token = req.get('Authorization');
        let params = req.params.activityID;

        UserController.authenticate(token, (auth) => {
            // If token is valid, continue
            if (auth) {
                Activity.findByIdAndDelete(params, (err, activity) => {
                    // Check if error occured
                    if (err) {
                        // Error occured
                        res.status(400).send(new ApiResponse(err.message, 400)).end();
                        return;
                    }
                    if (!activity) {
                        // No component found, returning 404
                        res.status(404).send(new ApiResponse("No activity found with that ID", 404)).end();
                        return;
                    } else {
                        // Component was deleted successfully. Returning 200 response
                        res.status(200).send(new ApiResponse("Activity successfully deleted", 200)).end();
                        return;
                    }
                })

            } else {
                // Invalid token, send 401 response
                res.status(401).send(new ApiResponse('Invalid or missing token. Unauthenticated', 401)).end();
            }
        });
    }
};