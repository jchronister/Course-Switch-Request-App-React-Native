"use strict";

const {ObjectID} = require("mongodb");
const createError = require('http-errors');

/** Checks for Invalid/Missing Data
* @param {any} value - Value to Check
* @returns {boolean} Is Data Valid true/false
*/
  let isInvalid = function (value) {
  return value === undefined || value === "";
};


/** Checks Object for Invalid/Missing Properties
* @param {string []} aryRequired - Array of Required Properties
* @param {object} objValues - Object to Check
* @param {function} next - Next Function for Errors
* @param {object []} aryRename - Rename Array for User { key: Rename }
* @returns {boolean} true if Data Missing
*/
const isMissing = function (aryRequired, objValues, next, aryRename) {

  // Filter Out Valid Data
  let missing = aryRequired.filter(n => isInvalid(objValues[n]));

  // Format Missing Data Return String
  if (missing.length) {

    // Rename
    missing = missing.map(n => aryRename && aryRename[n] || n);

    next(createError("Missing Data for: " + missing.join(", ")));
    return true;
  }
  return false;
};

/** Checks Object for Extra Properties
* @param {String []} aryAllowed - Array of Allowed Properties
* @param {Object} objValues - Object to Check
* @param {function} next - Next Function for Errors
* @returns {boolean} true if Extra Data
*/
const isExtra = function(aryAllowed, objValues, next) {

  // Filter Out Allowed Data
  const extra = Object.keys(objValues).filter(n => !aryAllowed.includes(n));

  // Format Missing Data Return String
  if (extra.length) {
    next(createError("Extra Invalid Data Included: " + extra.join(", ")));
    return true;
  }
  return false;
};



/** Checks Object for Valid Data if Key Exists
* @param {String} key - Object Property
* @param {Object} objValues - Object to Check
* @param {String []} valueAry - Array of Allowable Values
* @param {function} next - Next Function for Errors
* @returns {boolean} true if Valid
*/
const isValid = function(key, objValues, valueAry, next) {

  // If Key Exists AND Value in Valid
  if (objValues[key] && !valueAry.includes(objValues[key])) {
    next(createError("Invalid Data for '" + key + "' Needs to be: " + valueAry.join(", ")));
    return false;
  }
  return true;
};

/** Checks Object to See if Data Exists
* @param {Object} objValues - Object to Check
* @param {function} next - Next Function for Errors
* @returns {boolean} true if Data Exists
*/
const doesDataExist = function(objValues, next) {

  // If Key Exists AND Value in Valid
  let keys = Object.keys(objValues);

  if (keys.length === 0) {
    next(createError("No Data Provided"));
    return false;
  }

  // Check for Valid Data
  let invalid = keys.filter(n => isInvalid(objValues[n]));

   if (invalid.length) {
    next(createError("Invalid Data for keys: " + invalid.join(", ")));
    return false;
  } 
  return true;
};

/** Convert String to Mongo Id
* @param {string} str - String to Convert
* @param {function} next - Next Function for Errors
* @returns {objectID} - MongoDB _id
*/
const getMongoId = function (str, next) {

  try {

    return ObjectID(str);

  } catch (err) {

    next(createError("Invalid Mongo _id: " + str));

  }

};


/** Convert String to Mongo Id
* @param {object} req - Request Object
* @param {string} reqObj - Request Object
* @param {string} name - Key
* @param {any} value - Value
* @param {function} next - Next Function for Errors
* @returns {undefined}
*/
const setupMongoObjectIdonReq = function (req, reqObj, name, value, next) {

  const objectId = getMongoId(value, next);

  // Save Id and Proceed if Valid Mongo Object Id
  if (objectId) {
    req[reqObj][name] = objectId;
    return true;
  }

};


const switchRequestObject = function (req, block) {

  // Get Course Data from offering_id
  return req.db.collection("courses").findOne({"course_offerings.offering_id": req.body.offering_id},
    {projection: {_id: 0, block_id: 1, course_offerings: { $elemMatch: { "offering_id": req.body.offering_id } } }}
  )

  .then (data => {

    // New Course Not Found
    if (!data) throw "No Course Found for Offering_id " + req.body.offering_id;

    // Verify Course in Block if Needed
    if (block && data.block_id !== block) throw "Selected Course Not in Block";

    // Request Object
    const request = {

      student_id : ObjectID(req.token.student_id),
      student_name : req.token.student_name,
      request_id : new ObjectID(),
      desired_course : {
                          offering_id : req.body.offering_id,
                          course_id : data.course_offerings[0].course_id,
                          course_name : data.course_offerings[0].course_name,
                          instructor : data.course_offerings[0].instructor
                          },
      notes : req.body.notes || "",
      status : req.body.status || null,
      request_date : new Date()

  };

  return request;

  });

};



module.exports = {
  isMissing,
  isExtra,
  isValid,
  getMongoId,
  doesDataExist,
  setupMongoObjectIdonReq,
  switchRequestObject,
};