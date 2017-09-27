var express = require('express');
var express_session=require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Agenda=require('agenda');
var User=require('./models/user');

require('dotenv').load();
var index = require('./routes/index.js');
var app = express();
//database connection
mongoose.connect(process.env.MONGO_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//scheduling a daily reset of the database
var agenda =new Agenda({db: {address: process.env.MONGO_URI}});
agenda.define('delete stale information', function(job, done) {
  User.remove({}, done);
});
agenda.on('ready', function() {
  //schedule the deletion every day at midnight
  agenda.every('0 0 */1 * *', 'delete stale information');
  agenda.start();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//middleware loading
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express_session({ secret: 'best restaurant', resave: true, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'client')));

//routes definition
app.use('/',index);


var Listener =app.listen(process.env.PORT||3000,function(){
  console.log("server listening at port : "+Listener.address().port);
});




