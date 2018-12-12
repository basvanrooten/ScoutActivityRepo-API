const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
var validator = require('validator');

// Schema for User objects
const UserSchema = new Schema({
    email: {
        type: String,
        validate: [ validator.isEmail, 'Ongeldige Email.' ],
        required: [true, 'E-mail is vereist.']
    },
    firstName: {
        type: String,
        validate: {
            validator: (firstName) => firstName.length > 0 && firstName.length < 32,
            message: 'Ongeldige voornaam.'
        },
        required: [true, 'Voornaam is vereist.']
    },
    lastName: {
        type: String,
        validate: {
            validator: (lastName) => lastName.length > 1 && lastName.length < 64,
            message: 'Ongeldige achternaam.'
        },
        required: [true, 'Achternaam is vereist.']
    },
    password: {
        type: String,
        validate: {
            validator: (password) => password.length > 7 && password.length < 64,
            message: 'Wachtwoord moet groter zijn dan 7 karakters en korter dan 64 karakters.'
        },
        required: [true, 'Wachtwoord is vereist.']
    },
    salt: {
        type: String
    },
    permissions: {
        type: Number,
        default: 0
    }
});

// Add timestamp plugin
UserSchema.plugin(timestamps);

const User = mongoose.model('user', UserSchema);

module.exports = User;