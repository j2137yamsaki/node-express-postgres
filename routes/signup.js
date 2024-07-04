const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/', function (req, res, next) {
  knex("tasks")
    .select("*")
    .then(function (results) {
      console.log(results);
      res.render('index', {
        title: 'ToDo App',
        todos: results,
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
      });
    });
});

router.post('/', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
  
    knex("users")
      .where({
        name: username,
        password: password,
      })
      .select("*")
      .then((results) => {
        if (results.length === 0) {
          res.render("signin", {
            title: "Sign in",
            errorMessage: ["ユーザが見つかりません"],
          });
        } else {
          res.redirect('/');
        }
      })
      .catch(function (err) {
        console.error(err);
        res.render("signin", {
          title: "Sign in",
          errorMessage: [err.sqlMessage],
          isAuth: false,
        });
      });
  });

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));

module.exports = router;