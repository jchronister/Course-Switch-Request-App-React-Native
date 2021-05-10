var express = require('express');
var router = express.Router();

/*POST api/v1/signup */
router.post('/', function (req, res, next) {
    req.db.collection('users').findOne({ 'email': req.body.email, 'password': req.body.password })
        .then(resp => {
            if (!resp) {
                req.db.collection('users').insertOne(req.body)
                    .then(resp => {
                        res.json({ status: 'success' })
                    })
            } else {
                res.json({ status: 'failed user already exist,user must have unique email and password ' })
            }
        }).catch(err => {
            console.log(err);
        })
});



module.exports = router;