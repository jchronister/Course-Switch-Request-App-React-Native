"use strict";


const Jwtmanager = require('../jwt/jwtManager');

class Authorization {
    authenticate(req, res, next) {

        if (req.url === '/api/v1/login' || req.url === '/api/v1/signup') {
          return next();
        }

        let tokens = req.headers.authorization;
        // console.log(tokens);
        if (!tokens) {
            return res.json({ status: 'authentication_error' });
        } else {
            let data = Jwtmanager.verify(tokens);
            // console.log(data);
            if (!data) {
                return res.json({ status: 'authentication_error' });
            }
            // req.role = data.role;
            // req.id = data.id;
            next();
        }
    }

}

module.exports = new Authorization();
