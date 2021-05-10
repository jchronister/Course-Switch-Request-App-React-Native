var express = require('express');
var router = express.Router();
const { ObjectId } = require('bson');
const { MongoClient } = require('mongodb');


/*GET /api/v1/courses */
router.get('/', function (req, res, next) {
  req.db.collection("courses").aggregate([{ $unwind: "$course_offerings" },
  { $project: { "_id": 0, course_name: "$course_offerings.course_name", requests_counter: { $size: "$course_offerings.switch_requests" }, course_id: "$course_offerings.course_id" } }]).toArray()
    .then(resp => {
      res.json({ status: 'success', result: resp })
    }).catch(err => {
      console.log(err)
    })
});


/*GET /api/v1/courses/:offering_id */
router.get('/:offering_id', function (req, res, next) {
  req.db.collection("courses").find({}).project({ course_offerings: { $elemMatch: { "offering_id": new ObjectId(req.params.offering_id) } } }).toArray()
    .then(resp => {
      res.json({ status: 'success', result: resp })
    }).catch(err => {
      console.log(err)
    })
});


/*POST /api/v1/courses/:id */
router.post('/:course_id', function (req, res, next) {
  // req.db.collection("courses").updateOne({ course_offerings:{$elemMatch:{offering_id:req.params.offering_id}}},{$push:{'course_offerings.$.switch_requests':req.body}})
  req.db.collection("courses").updateOne({ "course_offerings.offering_id": ObjectId(req.params.course_id) }, { $push: { "course_offerings.$.switch_requests": req.body } })
    .then(resp => {
      res.json({ status: "success" })
    }).catch(err => {
      console.log(err);
    })
});


/*PUT /api/v1/courses/:id/posts/post_id */
router.put('/:course_id/posts/:request_id', function (req, res, next) {
  req.db.collection("courses").updateOne({},
    { $set: { "course_offerings.$[objs].switch_requests.$[obj].student_name": "Test" } },
    { arrayFilters: [{ "objs.offering_id": ObjectId(req.params.course_id) }, { "obj.request_id": ObjectId(req.params.request_id) }] }
  )
    .then(resp => {
      res.json({ status: "success" })
    }).catch(err => {
      console.log(err);
    })

});

/*DELETE /api/v1/courses/:id/posts/post_id */
router.delete('/:course_id/posts/:request_id', function (req, res, next) {
  req.db.collection("courses").updateOne({ "course_offerings.offering_id": ObjectId(req.params.course_id) }, { $pull: { "course_offerings.$.switch_requests": { request_id: ObjectId(req.params.request_id) } } })
    .then(resp => {
      res.json({ status: "success" })
    }).catch(err => {
      console.log(err);
    })

});



module.exports = router;
