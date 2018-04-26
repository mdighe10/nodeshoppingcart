var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();

//mongoose.connect('mongodb://mongodbshoppingcart:iKRAvvDH2DrjfvtqUI4o0hzw1GuayW5imeiu0xLDoo2W8l3doc9uqZIXpZZuq213Iw6bL41oNbGXAyyIPCY3hA%3D%3D@mongodbshoppingcart.documents.azure.com:10255/shopping?ssl=true');
mongoose.connect('mongodb://nodejsazure:OZfC5b0Xkyv04mOHWEHtzcaUgbBRPbXPRuP0zVqNsOwPIbbMTKVBRxj2crV7KXSXXgLb2d6osP7oFnyyWvBfNw%3D%3D@nodejsazure.documents.azure.com:10255/shopping?ssl=true');

require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret', 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next){
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
app.use('/user', userRoutes);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
