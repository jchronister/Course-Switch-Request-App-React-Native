"use strict";

var express = require('express');
var router = express.Router();
const createError = require('http-errors');

const {setupMongoObjectIdonReq, switchRequestObject, isMissing, getMongoId} = require("../middleware/verify-data");
const {sendJSON} = require("../middleware/return-object");


// Routes
router.route("/")
  .get(getCourseOfferingsByDateAsc);

router.route("/switchrequests")
  .get(getSwitchRequestsbyDateDesc)
  .post(addSwitchRequest);

router.route("/:offering_id")
  .get(getCourseOfferingById);

router.route("/switchrequests/:request_id")
  .all(verifyUserOwnsSwitch)
  .put(updateSwitchRequest)
  .delete(deleteSwitchRequest);



// Verify & Set offering_id Mongo Object Id
router.param("offering_id", (req, res, next, id) => {
  if (setupMongoObjectIdonReq(req, "params", "offering_id", id, next)) next(); 
});

// Verify & Set request_id Mongo Object Id
router.param("request_id", (req, res, next, id) => {
  if (setupMongoObjectIdonReq(req, "params", "request_id", id, next)) next();  
});



// GET /api/v1/courses - Sorted Asc by Date
// router.get('/', function (req, res) {
function getCourseOfferingsByDateAsc (req, res) {

  req.db.collection("courses").aggregate([{ $unwind: "$course_offerings" },
    { $sort : { "begin_data" : 1 } },
    { $project: { 
      "_id": 0, 
      course_name: "$course_offerings.course_name", 
      requests_counter: { $size: "$course_offerings.switch_requests" }, 
      course_id: "$course_offerings.course_id",
      block: "$block_id",
      offering_id: "$course_offerings.offering_id"
    } }])
    .toArray(sendJSON.bind(res));

}


/*GET /api/v1/courses/:offering_id */
// router.get('/:offering_id', function (req, res) {
function getCourseOfferingById (req, res) {

  req.db.collection("courses").find({"course_offerings.offering_id": req.params.offering_id})
    .project({_id: 0, course_offerings: { $elemMatch: { "offering_id": req.params.offering_id } } })
    .toArray(sendJSON.bind(res));

}



//POST /api/v1/courses/:offering_id/switchrequests/
function addSwitchRequest (req, res, next) {
// router.post('/switchrequests', function (req, res, next) {
              
  let currentCourse;

  // Verify Required Data is Present
  if (isMissing(["offering_id", "block_id"], req.body, next)) return;

  // Verify & Convert Object Id
  if (!setupMongoObjectIdonReq(req, "body", "offering_id", req.body.offering_id, next)) return;

  // Get Students Current Course
  req.db.collection("courses").findOne({
    block_id : req.body.block_id, 
    "course_offerings.students.student_id": getMongoId(req.token.student_id, next)},
    {projection: {_id: 0, "course_offerings.$": 1}}
  )  

  .then( course => {

    // Verify Current Course
    if (!course) throw "Cannot Find Students Current Course for Block";
    
    // Verify Selected Course is Not Current Course
    currentCourse = course.course_offerings[0].offering_id;
    if (currentCourse.toString() === req.body.offering_id.toString()) {
      throw "Student Already Scheduled for this Course";
    }

    // Verify Do Not Have a Request Already
    if (course.course_offerings[0].switch_requests.reduce(
      (a, n) => a || n.student_id.toString() === req.token.student_id, false)) {
        throw "Switch Already Requested for this User";
    }

    // Get New Class Request Object
    return switchRequestObject(req, req.body.block_id);

  })
  

  // Add Request to Current Course Switch Request
  .then( request => {

    if (request) req.db.collection("courses").updateOne(
      { "course_offerings.offering_id": currentCourse }, 
      { $push: { "course_offerings.$.switch_requests": request } },
      sendJSON.bind(res));
  })

  .catch(next);

}



//PUT /api/v1/courses/switchrequests/:request_id
// router.put('/switchrequests/:request_id', verifyUserOwnsSwitch, function (req, res, next) {
function updateSwitchRequest (req, res, next) {

  // Verify Required Data is Present
  if (isMissing(["offering_id"], req.body, next)) return;

  // Verify & Convert Object Id
  if (!setupMongoObjectIdonReq(req, "body", "offering_id", req.body.offering_id, next)) return ;

  // Verify Data & Get Switch Request Object
  switchRequestObject(req, req.switchRequest.block_id)

  .then ( request => {

    // Update data
    if (request) req.db.collection("courses").updateOne({},
      { $set: { "course_offerings.$[].switch_requests.$[switch].desired_course": request.desired_course ,
                "course_offerings.$[].switch_requests.$[switch].notes": request.notes} },
      { arrayFilters: [{ "switch.request_id": req.params.request_id }] },
      sendJSON.bind(res));

  })
  .catch(next);
    
}


//DELETE /api/v1/courses/switchrequests/:request_id
// router.delete('/switchrequests/:request_id', verifyUserOwnsSwitch, function (req, res) {
function deleteSwitchRequest (req, res) {

  req.db.collection("courses").updateOne({},
    { $pull: { "course_offerings.$[].switch_requests": { request_id: req.params.request_id } } },
    sendJSON.bind(res));

}


function verifyUserOwnsSwitch (req, res, next) {

  // Retrieve Student Id for Switch Request
  req.db.collection("courses").aggregate([
    {$match: {"course_offerings.switch_requests.request_id": req.params.request_id }},
    { "$unwind": "$course_offerings" },
    { "$unwind": "$course_offerings.switch_requests" },
    {$match: {"course_offerings.switch_requests.request_id": req.params.request_id }},
    {$project: {_id: 0, request: "$course_offerings.switch_requests"}}
  ]).toArray()

  .then(data => {

    // No Match
    if (!data.length) return next(createError("Invalid Switch Request Id"));
    
    // Verify Id's Match
    if(data[0].request.student_id.toString() !== req.token.student_id) {
        return next(createError("Error User Does Not Own Switch Request"));
    }

    // Store Request Info
    req.switchRequest = data[0].request;

   next();
    
  })

  .catch(next);

}

function getSwitchRequestsbyDateDesc(req, res) {

  req.db.collection("courses").aggregate([
    { "$unwind": "$course_offerings" },
    { "$unwind": "$course_offerings.switch_requests" },
    { $sort: {"course_offerings.switch_requests.request_date": -1} },
    // {$project: {_id: 0, request: "$course_offerings.switch_requests"}}
    {$project: {_id: 0, "course_offerings.students": 0}}
    
  ]).toArray(sendJSON.bind(res));



}

module.exports = router;
