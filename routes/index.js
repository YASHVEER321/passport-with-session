const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();


router.get('/', (req, res) => {
    console.log("In localhost:3000/",req.user);
    res.render('index', { user : req.user });
});

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    //When using passport mongoose plugin
    // Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
    //     if (err) {
    //       return res.render('register', { error : err.message });
    //     }
    //     passport.authenticate('local')(req, res, () => {
    //         req.session.save((err) => {
    //             if (err) {
    //                 return next(err);
    //             }
    //             res.redirect('/');
    //         });
    //     });
    // });

    let account=new Account();
    account.username=req.body.username;
    account.password=req.body.password;
    account.address=req.body.address;
    account.companyName=req.body.companyName;
    console.log("Request Value",req.body);
    account.save((err,data)=>{
         if (err) {
                    return next(err);
                }
                res.redirect('/login');
    })
});


router.get('/login', (req, res) => {
    console.log("In Get");
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', 
    passport.authenticate('local', {
     failureRedirect: '/login', failureFlash: true 
 }),
     (req, res, next) => {
         console.log("In Post");
                   req.session.save((err) => {
           if (err) {
            return next(err);
            }
        res.redirect('/');
    }); 
});


router.get('/profile', (req, res, next) => {
    if(req.user==undefined){
        res.redirect('/login');
    }
    else{
        Account.findOne({username:req.user.username},(err,data)=>{
        console.log("In profile",data);
        res.render('profile', { user : data, error : req.flash('error')});
  })
    }
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

module.exports = router;
