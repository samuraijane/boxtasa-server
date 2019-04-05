const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {User} = require('./../models');


// -----------------------------------------------------------------------------
//                                    DELETE
// -----------------------------------------------------------------------------
router.delete('/:id', (req, res) => {
  User
  .findByIdAndRemove(req.params.id)
  .exec()
  .then(() => {
    res.status(204).json({  //TODO chaining .json to res.status in order to show a message does not work, check syntax
      message: "User has been deleted."
    })
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({
      message: "The attempt to delete the user has failed."
    })
  })
});

// -----------------------------------------------------------------------------
//                                    GET ALL
// -----------------------------------------------------------------------------
router.get('/', (req, res) => {
  User
  .find()
  .exec()
  .then(users => {
    res.json({
      users: users.map( user => user.apiRepr() )
    });
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({message: 'Internal server error'});
  });
});


// -----------------------------------------------------------------------------
//                                  GET SINGLE
// -----------------------------------------------------------------------------
router.get('/:id', (req, res) => {
  User
  .findById(req.params.id)
  .exec()
  .then( user => {
    res.json({
      user: user.apiRepr()
    })
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({message: 'Internal server error'});
  });
});


// -----------------------------------------------------------------------------
//                                     POST
// -----------------------------------------------------------------------------
router.post('/register', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 4,
      max: 16
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
            .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
            .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password} = req.body;

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash
      });
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});


// -----------------------------------------------------------------------------
//                                      PUT
// -----------------------------------------------------------------------------



module.exports = {router};
