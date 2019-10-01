var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

var User = new Schema({
    email : {
        type : String,
        unique : true,
        lowercase : true    // the emails are converted into lowercase and then checked in the database.
    },
    password : {
        type : String
    }
});

// On Save Hook, encrypt password
User.pre('save',(next) => {
    const user = this;

    bcrypt.genSalt(10,(err,salt) => {
        if(err) { return next(err); }
        bcrypt.hash(user.password,salt,null,(err,hash) => {
            if(err) { return next(err); }
            user.password = hash;
            next();
        })
    });
});

module.exports = mongoose.model('User',User);