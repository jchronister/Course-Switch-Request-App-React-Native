
var express = require('express');
var router = express.Router();
let Jwtmanager = require('../jwt/jwtManager')

/*POST api/v1/login */
router.post('/', function (req, res, next) {
  req.db.collection('users').findOne({ 'email': req.body.email, 'password': req.body.password }) 
    .then(resp => {
      if (resp) {
        //create the object needed
        let obj = req.body;

        let token = Jwtmanager.generet(obj);
        // decide on the return object
        res.json({ status: 'success', result: token})
      } else {
        res.json({ status: 'failed user not found,please signup' })
      }
    }).catch(err => {
      console.log(err);
    })
});



module.exports = router;
