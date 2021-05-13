var express = require('express');
var router = express.Router();
const createError = require('http-errors');
const bcrypt = require("bcryptjs");
let {isMissing} = require("../middleware/verify-data");
const {loginReturnObject} = require("../middleware/return-object");


/*POST api/v1/login */
router.post('/', function (req, res, next) {

  // Verify Valid Data
  if (isMissing(["email", "password"], req.body, next)) return;

  req.db.collection('users').findOne({email: req.body.email}) 
    .then(data => {

        // No Username Found
        if(!data) return next(createError("Invalid Username"));
    
        // Verify Password
        if (!bcrypt.compareSync("" + req.body.password, data.password)) return next(createError("Invalid Password"));

        // Return Token
        res.json(loginReturnObject(data));

    }).catch(next);
});


module.exports = router;
