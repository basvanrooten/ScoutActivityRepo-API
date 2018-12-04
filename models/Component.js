const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

// Schema for Component objects
const ComponentSchema = new Schema({
    name: {
        type: String,
        validate: {
            validator: (name) => name.length > 2 && name.length < 128,
            message: 'Ongeldige elementnaam.'
        },
        required: [true, 'Opkomstnaam is vereist.']
    },
    expressionField: {
        type: String,
        required: [true, 'Expressiegebied is vereist.']
    },
    duration: {
        type: Number,
        required: [true, 'Tijdsduur in minuten is verplicht.']
    },
    budget: {
        type: Number,
        default: 0
    },
    componentText: {
        type: String,
        validate: {
            validator: (componentText) => componentText.length > 31,
            message: 'Uitwerking is te kort.'
        },
        required: [true, 'Uitwerking is vereist.']
    },
});

// Add timestamp plugin
ComponentSchema.plugin(timestamps);

const Component = mongoose.model('Component', ComponentSchema);

module.exports = Component;