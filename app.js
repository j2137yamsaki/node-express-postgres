const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const app = express();
const secret = "secretCuisine123";

function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/signin');
}

app.use(
  cookieSession({
    name: 'session',
    keys: [secret],
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

let todos = [];

app.get('/', (req, res) => {
  const isAuth = req.session.user ? true : false;
  res.render('index', { title: 'TodoApp', isAuth: isAuth, todos: isAuth ? todos : [] });
});

app.post('/', ensureAuthenticated, (req, res) => {
  const { add, deadline, priority } = req.body;
  const newTodo = {
    content: add,
    deadline: deadline,
    priority: priority,
  };
  todos.push(newTodo);
  res.redirect('/');
});

app.post('/signin', (req, res) => {
  const user = { username: req.body.username }; // Replace with actual user lookup
  req.session.user = user;
  res.redirect('/');
});

app.get('/signin', (req, res) => {
  res.render('signin', { title: 'Sign In' });
});

app.post('/signup', (req, res) => {
  const user = { username: req.body.username }; // Replace with actual user registration logic
  req.session.user = user;
  res.redirect('/');
});

app.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
