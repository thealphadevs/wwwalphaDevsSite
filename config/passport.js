//**************************************************
//Modules
//**************************************************

var user = require('./modules/user.js')


//**************************************************
//Configuation
//**************************************************

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id)
    })

    passport.deserializeUser(function (id, done) {
        user.findById(id, function (err, userFound) {
            done(err, userFound);
        })
    })

    //**************************************************
    //Local Registration
    //**************************************************

    var LocalStrategy = require('passport-local').Strategy;

    passport.use('local-register', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {
            process.nextTick(function () {
                user.findOne({ 'local.username': username }, function (err, userFound) {
                    if (err) return done(err);
                    else if (userFound) return done(null, false, { msg: "User Already Registered" })
                    else if (!req.user) {
                        var newUser = new user();
                        newUser.local.username = username;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.local.name = req.body.name;
                        newUser.save(function (err) {
                            if (err) throw err
                            return done(null, newUser);
                        })
                    }
                    else {
                        var userConnect = req.user;
                        userConnect.local.username = username;
                        userConnect.local.password = userConnect.generateHash(password);
                        userConnect.local.name = req.body.name;
                        userConnect.save(function (err) {
                            if (err) throw err
                            return done(null, userConnect);
                        })

                    }
                })
            })
        }
    ))

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, username, password, done) {
            process.nextTick(function () {
                user.findOne({ 'local.username': username }, function (err, userFound) {
                    if (err) return done(err);
                    else if (!userFound) return done(null, false, { msg: "User Not Found" })
                    else if (!userFound.validPassword(password)) return done(null, false, { msg: "Invalid Credentials" })
                    return done(null, userFound)
                })
            })
        }
    ))

    //**************************************************
    //Google
    //**************************************************

    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var GoogleConfig = require('./google.js');


    passport.use(new GoogleStrategy({
        clientID: GoogleConfig.auth.clientID,
        clientSecret: GoogleConfig.auth.clientSecret,
        callbackURL: GoogleConfig.auth.callbackURL,
        scope: ['profile', 'email'],
        passReqToCallback: true
    },

        function (req, accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                if (!req.user) {
                    user.findOne().or([{ 'google.email': profile.emails[0].value }, { 'github.email': profile.emails[0].value }, { 'linkedin.email': profile.emails[0].value }]).exec(function (err, userFound) {

                        console.log(profile);

                        if (err) {
                            return done(err);
                        }
                        else if (userFound) {
                            if (userFound.google.email) {
                                return done(null, userFound);
                            }
                            else {
                                userFound.google.id = profile.id;
                                userFound.google.token = accessToken;
                                userFound.google.name = profile.displayName;
                                userFound.google.email = profile.emails[0].value;
                                userFound.google.photo = profile.photos[0].value;

                                userFound.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, userFound);
                                })
                            }
                        }
                        else {
                            var newUser = new user();
                            newUser.google.id = profile.id;
                            newUser.google.token = accessToken;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = profile.emails[0].value;
                            newUser.google.photo = profile.photos[0].value;

                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            })
                        }
                    });
                } else {
                    console.log(profile);

                    user.findOne({ 'google.email': profile.emails[0].value }).exec(function (err, userFound) {
                        if (err || userFound) {
                            done("Email already registered with another account")
                        }
                        else {
                            var userConnect = req.user;
                            userConnect.google.id = profile.id;
                            userConnect.google.token = accessToken;
                            userConnect.google.name = profile.displayName;
                            userConnect.google.email = profile.emails[0].value;
                            userConnect.google.photo = profile.photos[0].value;

                            userConnect.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, userConnect);
                            });
                        }
                    })

                }
            });
        }
    ));

    //**************************************************
    //Github
    //**************************************************

    var GitHubStrategy = require('passport-github2').Strategy;
    var GitHubConfig = require('./github.js');


    passport.use(new GitHubStrategy({
        clientID: GitHubConfig.auth.clientID,
        clientSecret: GitHubConfig.auth.clientSecret,
        callbackURL: GitHubConfig.auth.callbackURL,
        scope: ['user', 'user:email'],
        passReqToCallback: true
    },

        function (req, accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                if (!req.user) {
                    user.findOne().or([{ 'google.email': profile.emails[0].value }, { 'github.email': profile.emails[0].value }, { 'linkedin.email': profile.emails[0].value }]).exec(function (err, userFound) {

                        console.log(profile);

                        if (err) {
                            return done(err);
                        }
                        else if (userFound) {
                            if (userFound.github.email) {
                                return done(null, userFound);
                            }
                            else {
                                userFound.github.id = profile.id;
                                userFound.github.token = accessToken;
                                userFound.github.name = profile.displayName;
                                userFound.github.username = profile.username;
                                userFound.github.email = profile.emails[0].value;
                                userFound.github.photo = profile.photos[0].value;

                                userFound.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, userFound);
                                })
                            }
                        }
                        else {
                            var newUser = new user();
                            newUser.github.id = profile.id;
                            newUser.github.token = accessToken;
                            newUser.github.name = profile.displayName;
                            newUser.github.username = profile.username;
                            newUser.github.email = profile.emails[0].value;
                            newUser.github.photo = profile.photos[0].value;


                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            })
                        }
                    });
                } else {
                    console.log(profile);

                    user.findOne({ 'github.email': profile.emails[0].value }).exec(function (err, userFound) {
                        if (err || userFound) {
                            done("Email already registered with another account")
                        }
                        else {
                            var userConnect = req.user;
                            userConnect.github.id = profile.id;
                            userConnect.github.token = accessToken;
                            userConnect.github.name = profile.displayName;
                            userConnect.github.username = profile.username;
                            userConnect.github.email = profile.emails[0].value;
                            userConnect.github.photo = profile.photos[0].value;

                            userConnect.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, userConnect);
                            });
                        }
                    })
                }
            });
        }
    ));

    //**************************************************
    //Linkedin
    //**************************************************

    var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
    var LinkedinConfig = require('./linkedin.js');


    passport.use(new LinkedInStrategy({
        clientID: LinkedinConfig.auth.clientID,
        clientSecret: LinkedinConfig.auth.clientSecret,
        callbackURL: LinkedinConfig.auth.callbackURL,
        scope: ['r_emailaddress', 'r_liteprofile'],
        passReqToCallback: true
    },

        function (req, accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                if (!req.user) {
                    user.findOne().or([{ 'google.email': profile.emails[0].value }, { 'github.email': profile.emails[0].value }, { 'linkedin.email': profile.emails[0].value }]).exec(function (err, userFound) {

                        console.log(profile);

                        if (err) {
                            return done(err);
                        }
                        else if (userFound) {
                            if (userFound.linkedin.email) {
                                return done(null, userFound);
                            }
                            else {
                                userFound.linkedin.id = profile.id;
                                userFound.linkedin.token = accessToken;
                                userFound.linkedin.name = profile.displayName;
                                userFound.linkedin.email = profile.emails[0].value;
                                userFound.linkedin.photo = profile.photos[0].value;

                                userFound.save(function (err) {
                                    if (err)
                                        throw err;
                                    return done(null, userFound);
                                })
                            }
                        }
                        else {
                            var newUser = new user();
                            newUser.linkedin.id = profile.id;
                            newUser.linkedin.token = accessToken;
                            newUser.linkedin.name = profile.displayName;
                            newUser.linkedin.email = profile.emails[0].value;
                            newUser.linkedin.photo = profile.photos[0].value;

                            newUser.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            })
                        }
                    });
                } else {
                    console.log(profile);

                    user.findOne({ 'linkedin.email': profile.emails[0].value }).exec(function (err, userFound) {
                        if (err || userFound) {
                            done("Email already registered with another account")
                        }
                        else {
                            var userConnect = req.user;
                            userConnect.linkedin.id = profile.id;
                            userConnect.linkedin.token = accessToken;
                            userConnect.linkedin.name = profile.displayName;
                            userConnect.linkedin.email = profile.emails[0].value;
                            userConnect.linkedin.photo = profile.photos[0].value;

                            userConnect.save(function (err) {
                                if (err)
                                    throw err;
                                return done(null, userConnect);
                            });
                        }
                    })
                }
            });
        }
    ));

}