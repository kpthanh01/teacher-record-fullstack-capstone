'use strict'

const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {TEST_DATABASE_URL} = require('../config');
const Recipe = require('../models/recipe');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHTTP);

function seedRecipeData(){
	console.log('seeding RecipeData');
	const seedData = [];
	for(let i = 1; i<=10; i++){
		seedData.push(generateRecipeData());
	}
	return Recipe.insertMany(seedData);
}

const testUsername = faker.random.word() + faker.random.number();

function generateRecipeName(){
	const recipeName = ['Chocolate cake', 'Ice cream', 'Steak', 'Sushi', 'guacamole'];
	return recipeName[Math.floor(Math.random()*recipeName.length)];
}

function generateRecipeDescription(){
	const description = ['It is great', 'Butter Peacan', 'Salty and Sweet', 'Strong alcohol taste', 'terrible'];
	return description[Math.floor(Math.random()*description.length)];
}

function generateRecipeIngredients(){
	const ingredients = ['1 cup of sugar', '3 pints of milk', '7 avocados', 'pinch of salt', 'bucket of chocolate'];
	return ingredients[Math.floor(Math.random()*ingredients.length)];
}

function generateRecipeDirections(){
	const directions = ['cut avocados in half', 'bake to 200 Fahrenheit', '20min of cooling', 'pour 2ml of water', 'punch it'];
	return directions[Math.floor(Math.random()*directions.length)];
}
function generateRecipeData(){
	return {
		name: generateRecipeName(),
		description: generateRecipeDescription(),
		ingredients: generateRecipeIngredients(),
		directions: generateRecipeDirections(),
		user: testUsername
	}
}

function tearDownDb(){
	// console.warn('Deleting Database');
	// return mongoose.connection.dropDatabase();
}

describe('MyRecipe API resources', function(){
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function(){
		return seedRecipeData();
	});
	afterEach(function(){
		return tearDownDb();
	});
	after(function(){
		return closeServer();
	});

		it('should use GET Recipe endpoint and return all existing recipes of a user', function(){
			let res;
			return chai.request(app)
				.get(`/recipe/user/${testUsername}`)
				.then(function(_res){
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body).to.have.length.of.at.least(1);
					return Recipe.count();
				})
				.then(function(count){
					console.log('Number of Recipe: ' + count)
					expect(res.body.length).to.equal(count);
				});
		});

		it('should use POST Recipe endpoint and post/create a new recipe', function(){
			const newPost = generateRecipeData();
			
			return chai.request(app)
					.post('/recipe/create')
					.send(newPost)
					.then(function(res){
						expect(res).to.have.status(200);
						expect(res).to.be.json;
						expect(res.body).to.be.a('object');
						expect(res.body).to.include.keys('name', 'description', 'ingredients', 'directions');
						expect(res.body.id).to.not.be.null;
						expect(res.body.user).to.equal(newPost.user);
						expect(res.body.name).to.equal(newPost.name);
						expect(res.body.description).to.equal(newPost.description);
						expect(res.body.ingredients).to.equal(newPost.ingredients);
						expect(res.body.directions).to.equal(newPost.directions);
					});
		});

		it('should use PUT Recipe endpoint and update fields of a recipe', function(){
			const updateRecipe = {
				description: 'New Description',
				ingredients: 'New Ingredients',
				directions: 'New Directions'
			};
			return Recipe
					.findOne()
					.then(function(recipe){
						updateRecipe.id = recipe.id;
						return chai.request(app)
								.put(`/recipe/update/${updateRecipe.id}`)
								.send(updateRecipe);
					})
					.then(function(res){
						expect(res).to.have.status(204)
						return Recipe.findById(updateRecipe.id);
					})
					.then(function(recipe){
						expect(recipe.id).to.equal(updateRecipe.id);
						expect(recipe.description).to.equal(updateRecipe.description);
						expect(recipe.ingredients).to.equal(updateRecipe.ingredients);
						expect(recipe.directions).to.equal(updateRecipe.directions);
					});
		});

		it('should use DELETE Recipe endpoint and delete a recipe by id', function(){
			let deleteRecipe
			return Recipe
				.findOne()
				.then(function(res){
					deleteRecipe = res;
					return chai.request(app)
							.delete(`/recipe/delete/${deleteRecipe.id}`);
				})
				.then(function(res){
					expect(res).to.have.status(204);
					return Recipe.findById(deleteRecipe.id);
				})
				.then(function(res){
					expect(res).to.be.null;
				});
		});
});