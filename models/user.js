var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

module.exports = mongoose.model('User',User);