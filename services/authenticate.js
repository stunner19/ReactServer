var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var config = require('../config');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');  // used to require json web tokens.

var LocalOptions = { usernameField : 'email', passwordField : 'password' }
passport.use(new LocalStrategy(LocalOptions,function(email,password,done){
        User.findOne({ email : email}, (err,user) => {
            if(err){ return done(err); }
            if(!user){ return done(null,false); }
            return done(null,user);
            // user.comparePassword(password,function(err,isMatch){
            //     if(err) { return done(err); }
            //     if(!isMatch) { return done(null,false); }
            //     return done(null,user);
            // });
        });
    }
));

exports.getToken = function(user) {
    // the iat field is included by default. returns a signed token.
    return jwt.sign(user,config.secretKey,{expiresIn : 3600});
}

var opts = {}
// extract the token from auth field known as Authorization.
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = new JwtStrategy(opts,
    (jwt_payload,done) => {
        User.findById({ _id : jwt_payload._id}, (err,user) => {
            if(err){
                return done(err,false);
            }
            else if(user){
                return done(null,user);
            }
            else{
                return done(null,false);
            }
        });
    }
);

exports.verifyUser = passport.authenticate('jwt', { session : false});