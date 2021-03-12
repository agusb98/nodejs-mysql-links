/**
 * This route has all routes about login
 */

const { response } = require('express');
const express = require('express');
const router = express.Router();
const pass = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

//Sign an User by GET: used form render to form
router.get('/signup', isNotLoggedIn, (request, response) => {
    response.render('auth/signup');
});

//Sign an User by POST
router.post('/signup', isNotLoggedIn, pass.authenticate('local.signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (request, response) => {
    response.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (request, response, next) => {
    pass.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true,
    })(request, response, next);
});

router.get('/profile', isLoggedIn, (request, response) => {
    response.render('../views/auth/profile');
});

router.get('/logout', isLoggedIn, (request, response) => {
    request.logOut();
    response.redirect('/signin');
});

module.exports = router;
