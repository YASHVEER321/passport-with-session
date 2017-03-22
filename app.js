// dependenciesssss
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var sessionStore = require( "express-session" );
var routes = require('./routes/index');
var User = require('./models/account');

var app = express();
var sess;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(sessionStore({secret: 'ssshhhhh',cookie:{maxAge:10000}}));//expire in 10 second
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard yash',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);

// passport config
var Account = require('./models/account');
//passport.use(new LocalStrategy(Account.authenticate()));

passport.use(new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
       },function(req, username, password, done) { // callback with email and password from our form
        console.log("In passport_Test",username);
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  username,password:password }, function(err, user) {
            // if there are any errors, return the error before anything else
            console.log("Check in passport",user);
            if (err)
                return done(err);
            // if no user is found, return the message
            if (!user)
                return done(null, false,  { message: 'Incorrect user name or password.' }); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            // if (!user.validPassword(password))
            //     return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            // all is well, return successful user
            return done(null, user);
        });
    }));


passport.serializeUser((user,done)=>{
    console.log("Id Value------------->",user);
     done(null, user.id);
});
passport.deserializeUser((id,done)=>{
    console.log("Id Value is------------->",id);
       Account.findById(id, function(err, user) {
        console.log("username----->",user.username);
            done(err, user);
        });
});

// mongoose
mongoose.connect('mongodb://localhost/passport_Test');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(3000)
module.exports = app;
