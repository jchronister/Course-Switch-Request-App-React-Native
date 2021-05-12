"use strict";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors=require('cors');

const MongoClient=require('mongodb').MongoClient;
const client=new MongoClient("mongodb+srv://user1:C4U89mZsd@cluster0.5yjks.mongodb.net/?retryWrites=true&w=majority", { useUnifiedTopology: true });
let connection;
const loginRouter=require('./routes/login');
const signupRouter=require('./routes/signup');
const coursesRouter=require('./routes/courses');
const Authorization=require('./aau/autharautho');
const dataResetRouter = require("./routes/studentdata");

const {getReturnObject} = require("./middleware/return-object");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(function(req,res,next){
  if(!connection){
    console.log("connecting...");
    client.connect(function(err){
      if(err) return next(createError(500, err));
      connection=client.db('CS571FP');
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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 200).json(getReturnObject(err.message || err, null));
  res.status(200).json(getReturnObject(err.message || err, null));
  // res.render('error');
});


app.listen(8000,()=>{
  console.log('application is running on port : 8000');
});

// module.exports = app;
