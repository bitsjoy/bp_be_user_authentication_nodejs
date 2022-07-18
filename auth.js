const express = require('express')
const router = express.Router()
const User = require('./models/User')
const bcrypt = require('bcrypt')
const rounds = 10

const tokenVerification = require('./middleware')

const jwt = require('jsonwebtoken')
const tokenSecret = "token-secret"

router.get('/jwt-test', tokenVerification, (req, res) => {
    // #swagger.tags = ['auth']
    res.status(200).json(req.user)
})

router.post('/doesemailexist', (req, res) => {
    // #swagger.tags = ['auth']
    User.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                res.status(404).json({error: 'Email does not exist'})
            } else {
                res.status(200).json({error: 'Email exists'})
            }
        })
})


router.post('/login', (req, res) => {
    // #swagger.tags = ['auth']
    console.log(req.body);
        User.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                res.status(404).json({error: 'Email does not exist'})
            } else {
                bcrypt.compare(req.body.password, user.password, (error, match) => {
                    if(error) {
                        res.status(500).json(error)
                    } else if(match) {
                        res.status(200).json({token: generateToken(user), email: user.email, ppImageLink: user.ppImageLink, fullName: user.fullName})
                    } else {
                        res.status(403).json({error: 'Incorrect password'})
                    }
                })
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

  router.post('/signup', async (req, res) => {
      // #swagger.tags = ['auth']

      bcrypt.hash(req.body.password, rounds, (error, hash) => {
          if(error) {
             res.status(500).json(error)
          } else {
                  const newUser = User({
                      email: req.body.email,
                      password: hash,
                      ppImageLink: req.body.ppImageLink,
                      fullName: req.body.fullName
                  })
                  newUser.save()
                  .then(user => {
                    res.status(200).json({token: generateToken(user), email: user.email, ppImageLink: user.ppImageLink, fullName: user.fullName});
                  })
                  .catch(error => {
                      res.status(500).json(error)
                  })
          }
      })

  });

function generateToken(user){
    return jwt.sign({data: user}, tokenSecret, {expiresIn: '720h'}) // expires in 30 days
}

module.exports = router