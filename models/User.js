const mongoose = require('mongoose')

const user = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ppImageLink: {
        type: String
    }
});

module.exports = new mongoose.model("User", user)