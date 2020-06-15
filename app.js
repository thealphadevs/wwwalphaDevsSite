require('dotenv').config({ path: __dirname + '/.env' })

//**************************************************
//Setup
//**************************************************

var express = require('express')
var app = express();

var port = process.env.PORT || 3000;

var morgan = require('morgan')
var helmet = require('helmet');


var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var passport = require('passport')

//For Persistent-login
var MongoDBStore = require('connect-mongodb-session')(session);

app.set('view engine', 'ejs')
app.use(express.static((__dirname + '/public')));

//flash message 
var flash = require('connect-flash');
app.use(flash());


//**************************************************
//Database
//**************************************************

var mongoose = require('mongoose');
var congigDB = require('./config/mongoDB.js')

mongoose.connect(congigDB.url)

var store = new MongoDBStore({
    uri: congigDB.url,
    collection: 'mySessions'
});

// Catch errors
store.on('error', function (error) {
    console.log(error);
});

//**************************************************
//Setting Up Middlewares
//**************************************************

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.use(session({
    secret: "key",
    store: store,
    saveUninitialized: false,
    resave: false
}));

app.use(passport.initialize());
app.use(passport.session())

require('./config/passport')(passport);

app.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.Ferror = req.flash("error");
    res.locals.Fsuccess = req.flash("success");
    next();
})

//**************************************************
//Routes
//**************************************************

var indexRouter = require('./routes/index.js')
var authRouter = require('./routes/auth.js')

app.use('/', indexRouter);
app.use('/', authRouter);


app.use('*', function (req, res) {
    res.send('Error')
})

//**************************************************
//Start Server
//**************************************************

// app.listen(port, function () {
//     console.log("OAuth has Started")
// })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
    res.send("sorry")
});

module.exports = app;
