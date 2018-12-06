const Component = require('../models/Component');
const ApiResponse = require('../models/ApiReponse');
const UserController = require('../controllers/user_controller');
const assert = require('assert');

// Checking if component with the ID exists or not
function componentExists(name, callback) {
    Component.findOne({
            name: name
        })
        .then((component) => {
            if (component !== null) {
                callback(true);
            } else {
                callback(false);
            }
        })
};

module.exports = {

    // BODY: "name", "expressionField", "duration", "budget", "componentText"
    createComponent(req, res, next) {
        const componentProps = req.body;
        let token = req.get('Authorization');

        UserController.authenticate(token, (auth) => {
            // If token is valid, continue
            if (auth) {

                // Assert the incoming properties
                try {
                    assert(typeof (componentProps.name) === "string", "Onderdeelnaam moet een string zijn");
                    assert(typeof (componentProps.expressionField) === "string", "Expressiegebied moet een string zijn");
                    assert(typeof (componentProps.duration) === "number", "Expressiegebied moet een number zijn");
                    assert(typeof (componentProps.budget) === "number", "Budget moet een bedrag zijn");
                    assert(typeof (componentProps.componentText) === "string", "Uitwerking moet een string zijn");

                } catch (e) {
                    // Catch assertion error
                    res.status(422).send(new ApiResponse(e.message, 422));
                    return;
                }
                // If asserts are ok, check if component name already exists
                componentExists(componentProps.name, (result) => {
                    if (!result) {
                        Component.create(componentProps)
                            .then(component => {
                                res.status(200).send({
                                    "_id": component._id,
                                    "name": component.name,
                                    "expressionField": component.expressionField,
                                    "duration": component.duration,
                                    "budget": component.budget,
                                    "componentText": component.componentText,
                                    "createdAt": component.createdAt
                                })
                            })
                            .catch(e => {
                                res.status(412).send(new ApiResponse(e.message, 412));
                                return;
                            });
                    } else {
                        res.status(409).send(new ApiResponse("Component already exists", 409))
                    }
                })
            } else {
                res.status(401).send(new ApiResponse('Invalid or missing token. Unauthenticated', 401)).end();
            }

        });
    },

    getAllComponents(req, res, next) {
        let token = req.get('Authorization');

        UserController.authenticate(token, (auth) => {
            // If token is valid, continue
            if (auth) {
                Component.find()
                    .then(component => res.send(component))
                    .catch(next);

            } else {
                // Invalid token, send 401 response
                res.status(401).send(new ApiResponse('Invalid or missing token. Unauthenticated', 401)).end();
            }

        });
    },

    getComponentByID(req, res, next) {
        let token = req.get('Authorization');
        let params = req.params.componentID;

        UserController.authenticate(token, (auth) => {
            // If token is valid, continue
            if (auth) {
                Component.findById(params)
                    .then(component => res.send(component))
                    .catch(err => {
                        res.status(404).send(new ApiResponse("Component not found", 404));
                    });

            } else {
                // Invalid token, send 401 response
                res.status(401).send(new ApiResponse('Invalid or missing token. Unauthenticated', 401)).end();
            }
        });
    }
}