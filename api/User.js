const express = require('express');
const User = require('../models/User');
const router = express.Router();
const tokenVerification = require('../middleware');

router.post('/getUser', tokenVerification, async (req, res) => {
    User.findOne({email: req.body.email}).then( user => {
        if(!user){
            res.status(404);
        } else {
            res.status(200).json({fullName: user.fullName, ppImageLink: user.ppImageLink});
        }
    })
})

module.exports = {
    router: router
}