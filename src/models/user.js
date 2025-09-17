const mongoose = require('mongoose');
const validator = require('validator');

const { Schema, model } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 10,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email format');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error('Password is not strong enough');
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if(!['male', 'female', 'other'].includes(value.toLowerCase())) {
                throw new Error('Invalid gender value');
            }
        }
    },
    skills: {
        type: [String],
        validate(value) {
            if(!Array.isArray(value)) {
                throw new Error('Skills must be an array of strings');
            }
            if(value.length > 10) {
                throw new Error('A user can have a maximum of 10 skills');
            }
        }
    },
    about: {
        type: String,
        maxLength: 200,
        default: "This is a default about me section.",
    },
    profileUrl: {
        type: String,
        default: "https://example.com/default-profile.png",
    }
}, { timestamps: true });

const userModel = model("User", userSchema);
module.exports = userModel;
