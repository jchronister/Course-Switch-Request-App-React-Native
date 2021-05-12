"use strict";


const Jwtmanager = require('../jwt/jwtManager');
const createError = require('http-errors');

class Authorization {

    authenticate(req, res, next) {

        if (req.url === '/api/v1/login' || req.url === '/api/v1/signup') {
          return next();
        }

        let tokens = req.headers.authorization;
 
        if (!tokens) {

          return next(createError(400, "Missing Token"));

        } else {

            let data = Jwtmanager.verify(tokens);

            if (!data) return next(createError(400, "Invalid Token"));

            // Save Token Data
            req.token = data;
            next();
        }
    }

}

module.exports = new Authorization();
