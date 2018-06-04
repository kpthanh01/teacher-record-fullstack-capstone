"use strict"

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: false
	},
	description: {
		type: String,
		required: false
	},
	ingredients: {
		type: String,
		required: false
	},
	directions: {
		type: String,
		required: false
	},
	user: {
		type: String,
		required: false
	}
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;