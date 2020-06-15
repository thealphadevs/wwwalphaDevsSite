var express = require('express');
var router = express.Router();

//**************************************************
//Middlewares
//**************************************************

function isAlreadyLogged(req, res, next) {
    if (req.isAuthenticated()) {
        // req.flash("error", "Please LOGIN first!");
        res.redirect("/");
    }
    else {
        return next();
    }
}

//**************************************************
//Routes
//**************************************************

router.get('/', function (req, res) {
    res.render('index')
})

router.get('/index', function (req, res) {
    res.render('index')
})

router.get('/about-us', function (req, res) {
    res.render('about-us')
})

router.get('/community', function (req, res) {
    res.render('community')
})

router.get('/login', isAlreadyLogged, function (req, res) {
    res.render('login')
})

router.get('/our-work', function (req, res) {
    res.render('our-work')
})

router.get('/services', function (req, res) {
    res.render('services')
})

router.get('/signup', isAlreadyLogged, function (req, res) {
    res.render('signup')
})

router.get('/contact', function (req, res) {
    res.render('contact')
})


module.exports = router;
