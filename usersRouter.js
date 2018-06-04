const User = require('./models/user');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

const router = express.Router(); 
mongoose.Promise = global.Promise;

router.use(bodyParser.json());

// -------------USER ENDPOINTS---------------------------

// create a new user
router.post('/register', bodyParser.json(), (req, res) => {

	// takes the username and password from the newUserObject in client.js
	let username = req.body.username;
	let password = req.body.password;

	// find if user is in the database
	User.findOne({username}, function(err, items) {
			// if no connection
			if(err){
				return res.status(500).json({
					message: 'Internal server error'
				});
			}

			// if no user found
			if(!items){
				// create a new encryption key (salt)
				bcrypt.genSalt(10, (err, salt) =>{
					if(err){
						return res.status(500).json({
							message: 'Internal server error'
						});
					}

					// with the new key, encrypt the current password
					bcrypt.hash(password, salt, (err, hash) => {
						if(err){
							return res.status(500).json({
								message: 'Internal server error'
							});
						}
						User.create({
							username,
							password: hash
						}, (err, item) => {

							// if the database connection is NOT succesfull
							if(err){
								return res.status(500).json({
									message: 'Internal server error'
								});
							}

							// if the database connection is succesfull
							if(item){
								console.log(`User \`${username}\` created.`);
								return res.json(item);
							}
						});
					});
				});
			}
			// if user is found
			else {
				return res.status(401).json({
					message: 'Not Found'
				});
			}
		});
});


// login users
router.post('/login', (req, res) => {

	// takes the username and password from the loginUserObject in client.js
	const username = req.body.username;
	const password = req.body.password;

	// find if user is in the database
	User.findOne({username}, function(err, items) {
			// if no connection
			if(err){
				return res.status(500).json({
					message: 'Internal server error'
				});
			}

			// if no user found
			if(!items){
				return res.status(401).json({
					message: 'Not Found'
				});
			}

			// if user is found
			else {
				items.validatePassword(req.body.password, function(err, isValid){
					// if password validation is not working
					if(err){
						return res.status(500).json({
							message: 'Internal server error'
						});
					}

					// if password is not valid
					if(!isValid){
						return res.status(401).json({
							message: 'Not Found'
						});
					}

					// if password is valid
					else {
						return res.json(items);
					}
				});
			}
		});
});

module.exports = router;