$(document).ready(function(){
	$('section').hide();
	$('#create-btn').addClass('hideNavLink');
	$('#list-btn').addClass('hideNavLink');
	$('#logout-btn').addClass('hideNavLink');
	$('#landing-page').show();
});

// -----------Triggers----------------

// Go to login page
$('.login-trigger').click(function(event){
	event.preventDefault();
	$('section').hide();
	$('.alert').html('');
	$('.form-input-account').val('');
	$('#login-btn').addClass('hideNavLink');
	$('#register-btn').addClass('hideNavLink');
	$('#login-page').show();
});

// Go to register page
$('.register-trigger').click(function(event){
	event.preventDefault();
	$('section').hide();
	$('.alert').html('');
	$('.form-input-account').val('');
	$('#login-btn').addClass('hideNavLink');
	$('#register-btn').addClass('hideNavLink');
	$('#register-page').show();
});

// Go to recipe list page
$('#list-trigger').click(function(event){
	event.preventDefault();
	$('section').hide();
	$('.recipe-input').val('');
	$('#create-btn').removeClass('hideNavLink');
	$('#list-btn').addClass('hideNavLink');
	$('.recipe-info').hide();
	$('#list-page').show();
});

// Go to create recipe page
$('#create-trigger').click(function(event){
	event.preventDefault();
	$('section').hide();
	$('#create-btn').addClass('hideNavLink');
	$('#list-btn').removeClass('hideNavLink');
	$('#create-page').show();
});


// ----------Login Submit-----------------------
$('#login-form').submit(function(event){
	event.preventDefault();

	const username = $('#loginInput').val();
	const password = $('#loginPassword').val();

	if(username === '' || password === ''){
		$('.alert').html("Please enter both Username and Password");
	} else {
		const loginUserObject = {
			username: username,
			password: password
		};
		$.ajax({
			type: 'POST',
			url: '/users/login',
			dataType: 'json',
			data: JSON.stringify(loginUserObject),
			contentType: 'application/json'
		})
		.done(function(result){
			console.log(result);
			$('section').hide();
			$('.alert').html("");
			$('#create-btn').removeClass('hideNavLink');
			$('#logout-btn').removeClass('hideNavLink');
			$('#list-page').show();
			$('#loggedUserName').val(result.username);
			getRecipe(loginUserObject.username);
		})
		.fail(function(jqXHR, error, errorThrown){
			console.log(jqXHR);
			console.log(error);
			console.log(errorThrown);
			$('.alert').html('Please check Username and Password');
		});
	}
});


// --------Register Submit--------------
$('#register-form').submit(function(event){
	event.preventDefault();

	const username = $('#registerUsername').val();
	const password = $('#registerPassword').val();
	const confirmPass = $('#confirmPassword').val();

	if(password != confirmPass){
		$('.alert').html('Please make sure both password are the same');
	} else {
		const newUserObject = {
			username: username,
			password: password
		}
		$.ajax({
			type: 'POST',
			url: '/users/register',
			dataType: 'json',
			data: JSON.stringify(newUserObject),
			contentType: 'application/json'
		})
		.done(function(result){
			console.log(result);
			$('section').hide();
			$('.alert').html('');
			$('#create-btn').removeClass('hideNavLink');
			$('#logout-btn').removeClass('hideNavLink');
			$('#list-page').show();
			$('#loggedUserName').val(result.username);
			getRecipe(newUserObject.username);
		})
		.fail(function(jqXHR, error, errorThrown){
			$('.alert').html('Username is already taken!');
			console.log(jqXHR);
			console.log(error);
			console.log(errorThrown);
		});
	}
});


// ------------Create Recipe Submit------------
$('#recipe-form').submit(function(event){
	event.preventDefault();

	const recipeName = $('#create-name').val();
	const recipeDescription = $('#create-description').val();
	const recipeIngredients = $('#create-ingredients').val();
	const recipeDirection = $('#create-directions').val();
	const loggedUser = $('#loggedUserName').val();

	const newRecipeObject = {
		name: recipeName,
		description: recipeDescription,
		ingredients: recipeIngredients,
		directions: recipeDirection,
		user: loggedUser
	};
	$.ajax({
		type: 'POST',
		url: '/recipe/create',
		dataType: 'json',
		data: JSON.stringify(newRecipeObject),
		contentType: 'application/json'
	})
	.done(function(result){
		getRecipe(loggedUser);
		$('.recipe-count').html('');
		$('section').hide();
		$('.recipe-input').val('');
		$('#create-btn').removeClass('hideNavLink');
		$('#list-btn').addClass('hideNavLink');
		$('#list-page').show();
	})
	.fail(function(jqXHR, error, errorThrown){
		console.log(jqXHR);
		console.log(error);
		console.log(errorThrown);
	});
});


// ---------Go to Update Recipe Page----------
$('.list').on('click', '.edit-recipe', function(event){
	event.preventDefault();
	const loggedUser = $('#loggedUserName').val();
	let recipeId = $(event.target).closest('.recipe').find('.recipe-Id').val();	
	$.ajax({
		type: 'GET',
		url: `/recipe/${recipeId}`,
		dataType: 'json'
	})
	.done(function(result){
		console.log(result);
		$('section').hide();
		$('#create-btn').addClass('hideNavLink');
		$('#list-btn').removeClass('hideNavLink');
		$('#edit-recipe-id').val(recipeId);
		$('#edit-description').val(result.description);
		$('#edit-ingredients').val(result.ingredients);
		$('#edit-directions').val(result.directions);
		$('#edit-page').show();
	})
	.fail(function(jqXHR, error, errorThrown){
		console.log(jqXHR);
		console.log(error);
		console.log(errorThrown);
	});
});


// --------Update Recipe--------------
$('#edit-form').submit(function(event){
	event.preventDefault();

	let editDescription = $('#edit-description').val();
	let editIngredients = $('#edit-ingredients').val();
	let editDirections = $('#edit-directions').val();
	let recipeId = $('#edit-recipe-id').val();
	const loggedUser = $('#loggedUserName').val();

	const updateRecipeObject = {
		description: editDescription,
		ingredients: editIngredients,
		directions: editDirections
	};

	$.ajax({
		type: 'PUT',
		url: `/recipe/update/${recipeId}`,
		dataType: 'json',
		data: JSON.stringify(updateRecipeObject),
		contentType: 'application/json'
	})
	.done(function(result){
		getRecipe(loggedUser);
		$('section').hide();
		$('.recipe-input').val('');
		$('#create-btn').removeClass('hideNavLink');
		$('#list-btn').addClass('hideNavLink');
		$('#list-page').show();
	})
	.fail(function(jqXHR, error, errorThrown){
		console.log(jqXHR);
		console.log(error);
		console.log(errorThrown);
	});

});



// -----------Delete Recipe---------
$('.list').on('click', '.delete-recipe', function(event){
	event.preventDefault();
	const loggedUser = $('#loggedUserName').val();
	let recipeId = $(event.target).closest('.recipe').find('.recipe-Id').val();
	$.ajax({
		type: 'DELETE',
		url: `/recipe/delete/${recipeId}`,
	})
	.done(function(result){
		getRecipe(loggedUser);
	})
	.fail(function(jqXHR, error, errorThrown){
		console.log(jqXHR);
		console.log(error);
		console.log(errorThrown);
	});
});


// --------Logout----------------
$('#logout-trigger').on('click', function(event){
	location.reload();
});


// -------------MISC---------------------

// trigger animation to shwo detail info of a recipe
$('.list').on('click', '.recipe-btn', function(event){
	$(event.target).next().slideToggle(500);
});



// --------Display Users Recipes----------
function displayRecipe(result){
	let buildRecipe = '';
	$.each(result, function(resultKey, resultValue) {
		buildRecipe += '<div class="recipe">';
		buildRecipe += `<input class="recipe-Id" type="hidden" value="${resultValue._id}">`;
		buildRecipe += `<button class="recipe-btn">${resultValue.name}</button>`;
		buildRecipe += '<div class="recipe-info">';
		buildRecipe += `<p><strong>Description:</strong><br> ${resultValue.description}</p>`;
		buildRecipe += `<p><strong>Ingredients:</strong><br> ${resultValue.ingredients}</p>`;
		buildRecipe += `<p><strong>Directions:</strong><br> ${resultValue.directions}</p>`;
		buildRecipe += '<button class="edit-recipe edit-delete-btn">Edit</button>';
		buildRecipe += '<button class="delete-recipe edit-delete-btn">Delete</button>';
		buildRecipe += '</div>';
		buildRecipe += '</div>';
	})
	$('.list').html(buildRecipe);	
}


function getRecipe(loggedUser){
	let results = $.ajax({
		type: 'GET',
		url: `/recipe/user/${loggedUser}`,
		dataType: 'json'
	})
	.done(function(result){
		if(result == ''){
			$('.recipe-count').html('You have no recipes saved!');
			displayRecipe(result);
		} else {
			displayRecipe(result);
		}	
	})
	.fail(function(jqXHR, error, errorThrown){
		console.log(jqXHR);
		console.log(error);
		console.log(errorThrown);
	});
}