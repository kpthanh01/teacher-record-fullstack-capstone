const Recipe = require('./models/recipe');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const router = express.Router(); 
mongoose.Promise = global.Promise;

router.use(bodyParser.json());


// -------------USER ENDPOINTS---------------------------

// get all user's recipe
router.get('/user/:userId', (req, res) => {
	Recipe.find({
		user: req.params.userId
	}, function(err, recipes){
		if(err){
			res.send(err);
		} 
		return res.json(recipes);
	});
});

// get recipe by id
router.get('/:id', (req, res) => {
	Recipe.findById(req.params.id).exec().then(function(recipe){
		return res.json(recipe);
	})
	.catch(err => {
		return res.status(500).json({
			message: 'Internal server error'
		});
	})
});


// create new recipe
router.post('/create', (req, res) => {

	let name = req.body.name;
	let description = req.body.description;
	let ingredients = req.body.ingredients;
	let directions = req.body.directions;
	let user = req.body.user;

	Recipe.create({
		name,
		description,
		ingredients,
		directions,
		user
	}, (err, item) => {
		if(err){
			return res.status(500).json({
				message: 'Internal server error'
			});
		}
		if(item){
			console.log(`The recipe \'${name}\' is created`)
			return res.json(item);
		}
	})

});

// update recipe
router.put('/update/:id', (req, res) => {

	let toUpdate = {};
	let updateableFields = ['description', 'ingredients', 'directions'];
	updateableFields.forEach(function(field){
		if(field in req.body){
			toUpdate[field] = req.body[field];
		}
	});

	Recipe.findByIdAndUpdate(req.params.id, {
		$set: toUpdate
	})
	.exec()
	.then(function(recipe){
		return res.status(204).end();
	})
	.catch(function(err){
		return res.status(500).json({
			message: 'Internal sever error'
		});
	});
});

// delete recipe
router.delete('/delete/:id', (req, res) => {
	Recipe.findByIdAndRemove(req.params.id).exec().then(function(recipe){
		console.log(`Deleted recipe item ${req.params.id}`);
		return res.status(204).end();
	})
	.catch(function(err){
		return res.status(500).json({
			message: 'Internal server error'
		});
	});
});

// --------MISC------------
// catch all endpoint if client makes request to non-existing endpoints
router.use('*', function(req, res){
	res.status(404).json({
		message: 'Not Found'
	});
});

module.exports = router;