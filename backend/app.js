"use strict";

require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
// var path = require('path');
var logger = require('morgan');
const cors=require('cors');

const MongoClient=require('mongodb').MongoClient;
const client=new MongoClient(process.env.DB_ConnectionString, { useUnifiedTopology: true });
let connection;
const loginRouter=require('./routes/login');
const signupRouter=require('./routes/signup');
const coursesRouter=require('./routes/courses');
const Authorization=require('./aau/autharautho');
const dataResetRouter = require("./routes/studentdata");

const {getReturnObject} = require("./middleware/return-object");

var app = express();


app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(function(req,res,next){
  if(!connection){
    console.log("connecting...");
    client.connect(function(err){
      if(err) return next(createError(500, err));
      connection=client.db(process.env.DB_Name);
      req.db=connection;
      next();
    });
  }else{
    req.db=connection;
    next();
  }
});
app.use(Authorization.authenticate);

app.use('/api/v1/login', loginRouter);
app.use('/api/v1/signup', signupRouter);
app.use('/api/v1/courses',coursesRouter);
app.use('/api/v1/resetdata',dataResetRouter);
  

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, "URL Not Found"));
});

// error handler
app.use(function(err, req, res, next) {// eslint-disable-line no-unused-vars

  // res.status(err.status || 200).json(getReturnObject(err.message || err, null));
  res.status(200).json(getReturnObject(err.message || err, null));
});

module.exports = app;
