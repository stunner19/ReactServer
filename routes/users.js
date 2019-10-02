var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../services/authenticate');

router.use(bodyParser.json());-

/* GET users listing. */
router.post('/signup', (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	if(!email || !password){
		// we cant throw an error here because that works in promises.
		return res.status(422).send({error : 'You must provide email and password'});
	}

	User.findOne({ email : email })
	.then((user) => {
		if(user != null){
			var err = new Error(user + ' already exists');
			err.status = 403;
			next(err);
		}
		else{
			return User.create({
				email : email,
				password : password 
			});
		}
	})
	.then((user) => {
		if(user != undefined){
			user.save((err) => {
				if(err){
					return next(err);
				}
				else{
					res.statusCode = 200;
					res.setHeader('Content-Type','application/json');
					res.json({status : 'Registration Successful', user : user, token : authenticate.getToken({user})});
				}
			})
		}
	}, (err) => next(err))
	.catch((err) => next(err));
});

router.post('/login',passport.authenticate('local', { session : false}),(req,res) => {
	var token = authenticate.getToken({user : req.user});
	res.statusCode = 200;
	res.setHeader('Content-Type','application/json');
	res.json({ success: true, status : 'You are successfully logged in', token : token});
});

module.exports = router;