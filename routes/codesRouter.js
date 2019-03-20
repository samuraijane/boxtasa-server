const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Code} = require('./../models');


// -----------------------------------------------------------------------------
//                                    DELETE
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
//                                    GET ALL
// -----------------------------------------------------------------------------
router.get('/', (req, res) => {
  Code
  .find()
  .exec()
  .then(codes => {
    res.json(codes.map( code => code.apiRepr() ));
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
  Code
  .findById(req.params.id)
  .exec()
  .then( code => {
    res.json({
      code: code.apiRepr()
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



// -----------------------------------------------------------------------------
//                                      PUT
// -----------------------------------------------------------------------------



module.exports = {router};