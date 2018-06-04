"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    }
});

userSchema.methods.validatePassword = function(password, callback){
    bcrypt.compare(password, this.password, (err, isValid) => {
        if(err){
            callback(err);
            return;
        }
        callback(null, isValid);
    });
};

userSchema.statics.hashPassword = function(password){
    return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', userSchema);

module.exports = User;