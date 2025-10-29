const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const sassMiddleware = require('sass-middleware');
const fs = require('fs')

const session = require('express-session')
const bodyParser = require('body-parser');

const blogRouter = require('./dist/routes/esde');

const { logger } = require('./dist/backend/esdelogger');

const conf = require('./dist/backend/config').default;
const { passport } = require('./dist/backend/auth');

logger.info("Instanciando server")

let app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieParser(conf.sessionSecret));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

const store = new session.MemoryStore();
app.use(session({ store, secret: conf.sessionSecret, resave: false, saveUninitialized: false, cookie: { maxAge: 600000000, expires: 600000000 } }));


app.use(passport.initialize());
app.use(passport.session());

app.use((req, ___, next) => {
  if (req.session.views){ req.session.views++; }else{ req.session.views = 1; }
  next();
})

app.use('/', blogRouter);
// cargar_cache();


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
