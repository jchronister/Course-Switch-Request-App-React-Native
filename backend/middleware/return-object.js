"use strict";

let Jwtmanager = require('../jwt/jwtManager');

/** Object to Return to Client
* @param {Error} err - Error Message
* @param {Object} data = Data Object
* @returns {Object} - Object for Client
*/
const getReturnObject = function(err, data) {

  // Get Error Out of Object
  if (err && typeof err === "object") err = err.message;

  // Return Records Modified
  if (!Array.isArray(data) && data && typeof data === "object") {
    if ("insertedCount" in data) {
      var modified = data.insertedCount;
    } else if ("deletedCount" in data) {
      modified = data.deletedCount;
    } else if ("modifiedCount" in data) {
      modified = data.modifiedCount;
    }
  }

  // Return Object
  return {
      status : err ? "Failed" : "Success",
      data : modified === undefined ? data : null,  
      nModified: modified === undefined ? null : modified,
      error : err || null
  };

};


/** Send JSON Object to Client (Bind res to Function Call) 
* @param {Error} err - Error Message
* @param {Object} data = Data Object
* @returns {undefined}
*/
const sendJSON = function(err, data) {

  // Send Response
  if (!this.headersSent) this.json(getReturnObject(err, data));

};  


// Generator User Return Token
function loginReturnObject (data) {

  // Return Token
  let retrn = {
    student_name: data.student_name,
    email: data.email,
    student_id: data._id
  };

  return getReturnObject(null, Jwtmanager.generet(retrn, process.env.jwtToken));

}


module.exports = {
  getReturnObject,
  sendJSON,
  loginReturnObject
};