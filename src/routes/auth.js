/* This module define routes of the below end points -
* - POST /signup
* - POST /login
* - POST /logout
*/

const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bycrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
    // receives various details from signup form
    // hashes the password using bcrypt
    // saves the user in db
    // sends a success response

    try {
        const user = new User(req.body);
        const password = req.body.password;
        const hashedPassword = await bycrypt.hash(password, 10);
        user.password = hashedPassword;

        user.save();
        res.status(201).send("User succesfully created");
    }
    catch(err) {
        res.status(500).send("Error signing up the user"+ err.message);
    }
});

authRouter.post('/login', async (req, res) => {
    // receive email and password from login form
    // validate email
    // if email exists, validate password using bycrypt.verify
    // if password i valid, generate a JWT token using jsonwebtoken
    // send the token in cookie
    // send success response
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            throw new Error("Invaid credentials");
        }
        
        const isPasswordMatch = await bycrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error("Invalid credentials");
        }

        const token = await user.getJWT();
        res.cookie("token", token, {expires: new Date(Date.now() + 7*3600000), httpOnly: true});
        res.send("USer logged in sucecssfully!");
    }
    catch(err) {
        res.status(500).send("Error signing in the user "+ err.message);
    }
});

authRouter.post('/logout', (req, res) => {
    res.cookie("token", null, {expires: new Date(Date.now()), httpOnly: true});
    res.send("User logged out successfully");
});

module.exports = authRouter;
