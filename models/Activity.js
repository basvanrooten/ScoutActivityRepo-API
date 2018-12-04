const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

// Schema for Activity objects
const ActivitySchema = new Schema({
    name: {
        type: String,
        validate: {
            validator: (name) => name.length > 3 && name.length < 128,
            message: 'Ongeldige opkomstnaam.'
        },
        required: [true, 'Opkomstnaam is vereist.']
    },
    date: {
        type: Date,
        required: [true, 'Datum is verplicht'],
        default: Date.now
    },
    expressionField: {
        type: String,
        required: [true, 'Expressiegebied is vereist.']
    },
    // STUB!
    elements: {
        type: String
    },
    author: {
        type: String,
        required: [true, 'Auteur is vereist.']
    }
});

// Add timestamp plugin
ActivitySchema.plugin(timestamps);

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;