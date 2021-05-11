"use strict";

var express = require('express');
var router = express.Router();

const {setupMongoObjectIdParameter, switchRequestObject} = require("../middleware/verify-data");
const {sendJSON} = require("../middleware/return-object");



// Verify & Set offering_id Mongo Object Id
router.param("offering_id", (req, res, next, id) => {
  setupMongoObjectIdParameter("offering_id", id, req, next);  
});

// Verify & Set request_id Mongo Object Id
router.param("request_id", (req, res, next, id) => {
  setupMongoObjectIdParameter("request_id", id, req, next);  
});


// GET /api/v1/courses - Sorted Asc by Date
router.get('/', function (req, res) {

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

});


/*GET /api/v1/courses/:offering_id */
router.get('/:offering_id', function (req, res) {

  req.db.collection("courses").find({"course_offerings.offering_id": req.params.offering_id})
    .project({_id: 0, course_offerings: { $elemMatch: { "offering_id": req.params.offering_id } } })
    .toArray(sendJSON.bind(res));

});


/*POST /api/v1/courses/:id */
//POST /api/v1/courses/:offering_id/switchrequests/
router.post('/:offering_id/switchrequests', function (req, res, next) {

  // Verify Data & Get Switch Request Object
  const data = switchRequestObject(req, next);

  // Send Data
  if (data) req.db.collection("courses").updateOne(
    { "course_offerings.offering_id": req.params.offering_id }, 
    { $push: { "course_offerings.$.switch_requests": data } },
    sendJSON.bind(res));

});


/*PUT /api/v1/courses/:id/posts/post_id */
//PUT /api/v1/courses/:offering_id/switchrequests/:request_id
router.put('/:offering_id/switchrequests/:request_id', function (req, res, next) {

  // Verify Data & Get Switch Request Object
  const data = switchRequestObject(req, next);

  // Update data
  if (data) req.db.collection("courses").updateOne({"course_offerings.offering_id": req.params.offering_id},
    { $set: { "course_offerings.$[course].switch_requests.$[switch].desired_course": data.desired_course ,
              "course_offerings.$[course].switch_requests.$[switch].notes": data.notes} },
    { arrayFilters: [{ "course.offering_id": req.params.offering_id }, { "switch.request_id": req.params.request_id }] },
    sendJSON.bind(res));
    
});

/*DELETE /api/v1/courses/:id/posts/post_id */
//DELETE /api/v1/courses/:offering_id/switchrequests/:request_id
router.delete('/:offering_id/switchrequests/:request_id', function (req, res) {

  req.db.collection("courses").updateOne(
    { "course_offerings.offering_id": req.params.offering_id }, 
    { $pull: { "course_offerings.$.switch_requests": { request_id: req.params.request_id } } },
    sendJSON.bind(res));

});



module.exports = router;
