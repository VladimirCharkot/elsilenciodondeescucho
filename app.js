const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('node-sass-middleware');
const fs = require('fs')

const passport = require('passport')
const session = require('express-session')
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;

const blogRouter = require('./routes/esde');

const { logger } = require('./procesos/esdelogger');

const conf = require('./procesos/config');

logger.info("Instanciando server")

let app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));





app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "najndjvnskjdnvijwnjovnqoneuqnvqw", resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log('Logueando...')
    if (password.trim() == conf.editor.password.trim()) {
      console.log('Login!')
      return done(null, {user: 'esde', username: 'esde', id: 'esde'})
    }
    console.log('Fail')
    return done(null, false)
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, {user: 'esde', username: 'esde', id: 'esde'})
});


app.use('/', blogRouter);


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
