const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const ObjectId = require("mongodb").ObjectID;
const { Code } = require("./../models");

// -----------------------------------------------------------------------------
//                                    DELETE
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//                                    GET ALL
// -----------------------------------------------------------------------------
router.get("/", (req, res) => {
  Code.find()
    .exec()
    .then(codes => {
      res.json(codes.map(code => code.apiRepr()));
    })
    .catch(err => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Internal server error", error: err });
    });
});

// -----------------------------------------------------------------------------
//                                  GET SINGLE
// -----------------------------------------------------------------------------
router.get("/:id", (req, res) => {
  Code.findById(req.params.id)
    .exec()
    .then(code => {
      res.json({
        code: code.apiRepr()
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    });
});

// -----------------------------------------------------------------------------
//                                     POST
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
//                                      PUT
// -----------------------------------------------------------------------------
router.put("/:id", (req, res) => {
  // TODO finish handling updates to multiple fields– the challenge here are the arrays
  const updateableFields = [
    "description",
    "keywords",
    "sampleNames",
    "subs",
    "summary",
    "title"
  ];
  if (req.params.id !== req.body.id) {
    const message = `The request path (${req.params.id}) and the request body id (${req.body.id}) must match.`;
    console.error(message);
    return res.status(400).json({ message: message });
  }
  // const singleFieldsToUpdate = {};
  // const subsFieldToUpdate = [];
  // singleFieldsToUpdate.updatedAt = new Date();

  // updateableFields.forEach(field => {
  //   if(field in req.body && field !== 'subs') {
  //     singleFieldsToUpdate[field] = req.body[field];
  //   } else if(field in req.body && field === 'subs') {
  //     subsFieldToUpdate.push(req.body[field]);
  //   }
  // });

  Code.updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        subs: req.body.subs
      }
    }
  )
    .exec()
    .then(code => {
      return res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    });
});

module.exports = { router };
