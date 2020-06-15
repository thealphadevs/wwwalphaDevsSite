var express = require('express');
var router = express.Router();

var passport = require('passport');


//**************************************************
//Models
//**************************************************

var user = require("../config/modules/user");

//**************************************************
//Middlewares
//**************************************************

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        // req.flash("error", "Please LOGIN first!");
        res.redirect("/");
    }
}

//**************************************************
//Routes
//**************************************************


//**************************************************
//Local Registration
//**************************************************

//Local Registration
router.post('/local/register', passport.authenticate('local-register', {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true
}), function (req, res) {
    console.log("User Registered")
})


//Local Login backend with custom callbacks
router.post('/local/login', passport.authenticate('local-login', {
    failWithError: true
}), function (req, res) {

    //Successfull login
    req.session.cookie.originalMaxAge = 7 * 24 * 60 * 60 * 1000 // Expires in 7 day
    res.redirect('/profile');

}, function (err, req, res, next) {

    //Unsuccessfull login
    res.redirect('/login')

})

//Link Local Account
router.get('/local/connect', function (req, res) {
    res.render('connect');
});

router.post('/local/connect', passport.authenticate('local-register', {
    successRedirect: '/profile',
    failureRedirect: '/local/connect',
    failureFlash: true
}));


//**************************************************
//Facebook
//**************************************************


router.get('/facebook/login', passport.authenticate('facebook')
);

router.get('/facebook/callback', function (req, res, next) {
    passport.authenticate('facebook', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/profile');
        });
    })(req, res, next);
});

router.get('/facebook/connect', passport.authorize('facebook'));

//**************************************************
//Google
//**************************************************


router.get('/google/login', passport.authenticate('google')
);

router.get('/google/callback', function (req, res, next) {
    passport.authenticate('google', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/profile');
        });
    })(req, res, next);
});

router.get('/google/connect', passport.authorize('google'));

//**************************************************
//Github
//**************************************************


router.get('/github/login', passport.authenticate('github')
);

router.get('/github/callback', function (req, res, next) {
    passport.authenticate('github', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/profile');
        });
    })(req, res, next);
});

router.get('/github/connect', passport.authorize('github'));

//**************************************************
//Linkedin
//**************************************************


router.get('/linkedin/login', passport.authenticate('linkedin')
);

router.get('/linkedin/callback', function (req, res, next) {
    passport.authenticate('linkedin', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/profile');
        });
    })(req, res, next);
});

router.get('/linkedin/connect', passport.authorize('linkedin'));

//**************************************************
//Dashboard and Logout
//**************************************************

//Profile page
router.get('/profile', isLogged, function (req, res) {
    res.render('profile')
})

//Logout Route
router.get('/logout', isLogged, function (req, res) {
    req.logout();
    res.redirect('/');
})

module.exports = router;
