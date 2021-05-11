"use strict";

const router = require('express').Router();
const createError = require('http-errors');
const bcrypt = require("bcryptjs");
let {isMissing} = require("../middleware/verify-data");
const {loginReturnObject} = require("../middleware/return-object");


/*POST api/v1/signup */
router.post('/', function (req, res, next) {

  // Verify Valid Data
  if (isMissing(["email", "password", "name"], req.body, next)) return;


  req.db.collection('users').findOne({ 'email': req.body.email })

  // Check for Duplicates & Add User
  .then(data => {

    // Username Already Exists
    if (data) return next(createError(400, "Username Already Exists"));

    // Insert New User
    return req.db.collection('users').insertOne({ 
      password: bcrypt.hashSync("" + req.body.password, 12),
      email: req.body.email,
      student_name: req.body.name
    });
  })

  // Verify Login Successfull
  .then(data => {
    
    if (data.insertedCount === 1) {

      // Return Token
      res.json(loginReturnObject(data.ops[0]));

    } else {
      next(createError(400, "Account Creation Error. Please Try Again"));
    }   
    
  })

  .catch(next);
  
});

module.exports = router;