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
// Before saving the user, run this function.
User.pre('save',(next) => {

    // get access to user model.
    const user = this;

    // generate a salt, then run callback.
    bcrypt.genSalt(10,(err,salt) => {
        if(err) { return next(err); }

        // hash the password using the salt.
        bcrypt.hash(user.password,salt,null,(err,hash) => {
            if(err) { return next(err); }

            // overwrite password with encrypted password.
            user.password = hash;
            next(); // save the model.
        })
    });
});

module.exports = mongoose.model('User',User);