const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const config = require('../config');

const createAuthToken = user => {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const router = express.Router();

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    session: false
  }),
  (req, res) => {
    const _token = createAuthToken(req.user.apiRepr());
    res.json({
      token: _token,
      username: req.user.username
    });
  }
);

router.get('/login', (req, res) => {
  res.json('{authToken}');
});

router.post('/refresh', passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
  }
);

router.get('/check', passport.authenticate('jwt', {
  session: false}), (req, res) => {
    res.json({
      isValidToken: true
    })
  }
);

module.exports = {router};
