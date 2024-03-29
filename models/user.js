var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var passportLocalMongoose = require('passport-local-mongoose');

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
User.pre('save', function(next){

    //get access to user model.
    const user = this;

    // generate a salt, then run callback. 
    
    bcrypt.genSalt(10,(err,salt) => {
        if(err) { return next(err); }
        // hash the password using the salt.
        bcrypt.hash(user.password,salt,null,function(err,hash){
            if(err) { return next(err); }
            // overwrite password with encrypted password.
            user.password = hash;
            next(); // save the model.
        });
    });
});

User.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err,isMatch) {
        if(err) { return callback(err); }
        callback(null, isMatch);
    });
}

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User',User);