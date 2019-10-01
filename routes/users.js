var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');

router.use(bodyParser.json());

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
					res.json({status : 'Registration Successful', user : user});
				}
			})
		}
	}, (err) => next(err))
	.catch((err) => next(err));
});

module.exports = router;