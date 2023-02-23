var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Routing
var indexRouter = require('./src/routes/index');
var messageRouter = require('./src/routes/message');
var followRouter = require('./src/routes/follow');
var signupRouter = require('./src/routes/signup');
var signinRouter = require('./src/routes/signin');
var userRouter = require('./src/routes/user');

var app = express();

app.use(session({
  secret: 'c2b71086dd6ba3b83431e00118d52c0fd2f178f439910fe7bf7e86a2a163e26f83932fac1f908015d7815bf0a817914e38ee56d904888337bff57c91c76ae8b1',
  resave: false,
  saveUninitialized: false
}));

// view engine setup
app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/message', messageRouter);
app.use('/follow', followRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/users', userRouter);

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
  //res.status(err.status || 500);
  //res.render('error');
});

module.exports = app;
