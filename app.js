let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let sassMiddleware = require('node-sass-middleware');
let fs = require('fs')

let passport = require('passport')
let session = require('express-session')
let bodyParser = require('body-parser');
let LocalStrategy = require('passport-local').Strategy;

let blogRouter = require('./routes/blog');


let app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
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




let pass = fs.readFileSync('.pass', 'utf8')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: "najndjvnskjdnvijwnjovnqoneuqnvqw", resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log('Logueando...')
    if (password.trim() == pass.trim()) {
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
