const ApiResponse = require('../models/ApiReponse');
const User = require('../models/User');
const config = require('../config/config');
const logger = require('../config/config').logger;
const jwt = require('jsonwebtoken');
const assert = require('assert');
const bcrypt = require('bcrypt');
const validator = require('validator');

let key = config.key;

    // This function checks if email exists in database.
    // If this is true, the user will exist
    function userExists(email, callback) {
        User.findOne({
                email: email
            })
            .then((user) => {
                if (user !== null) {
                    callback(true);
                } else {
                    callback(false);
                }
            })
    }

module.exports = {

    authenticate(token, callback) {
        
        if (token === undefined) {
            callback(false);
            return;
        }

        token = token.replace("Bearer ", '');
        try {
            let payload = jwt.verify(token, config.key);
            userExists(payload.email, (result) => {
                callback(result);
            });
        } catch (e) {
            logger.trace("Malfunctioning token! - " + token);
            callback(false);
            return;
        }
    },

    //  BODY: "email", "password"
    //  Checks credentials and returns JWT token if true
    login(req, res, next) {
        // Get user properties from body
        const userProps = req.body;
        try {
            // Check if body contains the right types
            assert(typeof (userProps.email) === "string", "Email moet een string zijn");
            assert(validator.isEmail(userProps.email), "Email is niet geldig")
            assert(typeof (userProps.password) === "string", "Wachtwoord moet een string zijn");
        } catch (e) {
            // Assertion exception
            res.status(422).send(new ApiResponse(e.message, 422)).end();
            return;
        }

        userExists(userProps.email, (result) => {
            // If result is true, continue
            if (result) {
                // Search the user
                User.findOne({
                        email: userProps.email
                    })
                    .then((user) => {
                        // Compare the password to the one found in the db
                        bcrypt.compare(userProps.password, user.password, (err, auth) => {
                            // If they match, sign the token
                            if (auth) {

                                jwt.sign({
                                    _id: user._id,
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    permissions: user.permissions,
                                    lastChanged: user.lastChanged
                                }, config.key, {
                                    expiresIn: config.jwtDuration
                                }, (err, token) => {
                                    // Send the token
                                    res.status(200).json({
                                        "token": token,
                                        "email": user.email,
                                        "firstName": user.firstName,
                                        "lastName": user.lastName
                                    }).end();
                                });
                            } else {
                                // No matching password found for email. Return error
                                res.status(401).send(new ApiResponse('Inloggegevens niet gevonden', 401)).end();
                            }
                        })
                    })
            } else {
                // No email found. Return error
                res.status(401).send(new ApiResponse('Ongeldige email', 401)).end();
            }
        });
    },

    // BODY: "email", "firstName", "lastName", "password", "confirmPassword"
    register(req, res, next){
        const userProps = req.body;

        try {
            assert(typeof (userProps.email) === "string", "Email moet een string zijn");
            assert(validator.isEmail(userProps.email), "Email is niet geldig")
            assert(userProps.email.length > 4, "Email moet langer zijn dan 5 karakters");

            assert(typeof (userProps.firstName) === "string", "Voornaam moet een string zijn");
            assert(userProps.firstName.length > 0, "Voornaam moet 1 karakter of groter zijn");
            assert(userProps.firstName.length < 32, "Voornaam moet kleiner zijn dan 32 karakters");

            assert(typeof (userProps.lastName) === "string", "Achternaam moet een string zijn");
            assert(userProps.lastName.length > 0, "Achternaam moet 1 karakter of groter zijn");
            assert(userProps.lastName.length < 64, "Achternaam moet kleiner zijn dan 64 karakters");

            assert(userProps.password.length > 7, "Wachtwoord moet langer zijn dan 7 karakters");
            assert(typeof (userProps.password) === "string", "Wachtwoord moet een string zijn");
            assert(typeof (userProps.passwordConfirm) === "string", "Wachtwoordbevestiging moet een string zijn");
            assert(userProps.password === userProps.passwordConfirm, "Wachtwoorden komen niet overeen");

        } catch (e) {
            // Assertion exception
            res.status(422).send(new ApiResponse(e.message, 422)).end();
            return;
        }

        // Check if email already exists
        userExists(userProps.email, (result) => {
            // If it doesn't exist, it's ok to register
            if(!result) {
                bcrypt.genSalt(10, (err, salt) => {
                    userProps.salt = salt;
                    bcrypt.hash(userProps.password, salt, (err, hash) => {
                        userProps.password = hash;
                        User.create(userProps)
                            .then((user) => res.status(200).send({
                                "_id": user._id,
                                "email": user.email,
                                "firstName": user.firstName,
                                "lastName": user.lastName,
                                "createdAt": user.createdAt
                            }))
                            .catch(next);
                    })
                });
            } else {
                res.status(409).send(new ApiResponse('Username already exists', 409)).end();
            }
        });
    }
};