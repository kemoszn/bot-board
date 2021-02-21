const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const elementSchema = new Schema({
    type: {
        type: String,
        required: true,
        default: "test"
    },
    suboptions: {
        type: Array,
        default: []
    },
    root: { 
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        default: "test"
    },
    text: {
        type: String
    }
});

module.exports = mongoose.model('Element', elementSchema)