"use strict";
/* eslint-disable  */

const jwt = require('jsonwebtoken')

const secrete = 'Elham-Hamid-secrete'

class Jwtmanager {
    generet(data) {
        let token = jwt.sign(data, secrete)
        return token;
    }

    verify(token) {
        let data = jwt.verify(token, secrete)
        return data;
    }
}



module.exports=new Jwtmanager();
