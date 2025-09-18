const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
    const user = new User(req.body);
    console.log(req.body);

    // persist the user in db
    try {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(201).send("User succesfully created");
    } catch (err) {
        res.status(400).send("Error saving the user"+ err.message);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).send("Invalid email");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(400).send("Invalid credentials");
        }

        // create a jwt token and send it to user as cookie
        const token = jwt.sign({_id: user._id}, "FirstJWTSecret");
        console.log("token", token);
        res.cookie("token", token);
        res.send("User logged in successfully");
    }
    catch(err) {
        res.status(500).send("Error logging in the user"+ err.message);
    }
})

app.get('/profile', async (req, res) => {
    try {
        console.log('cookie', req.cookies);
        // validate the cookie
        const {token} = req.cookies;
        if(!token) {
            return res.status(401).send("Unauthorized");
        }
        // validate token
        const { _id } = jwt.verify(token, "FirstJWTSecret");
        // validate user
        const user = await User.findById(_id);
        if(!user) {
            return res.status(404).send("User not found");
        }
        console.log("user", user);
        res.send(user);
    }
    catch(err) {
        res.status(500).send("Error fetching profile"+ err.message);
    }
});

// find user by email
app.get('/user', async (req, res) => {
    console.log(req.query);
    const user = await User.findOne({ email: req.query.email });
    console.log(user);
    try {
        if(!user) {
            res.status(404).send("User not found");
        }
        res.send(user);
    }
    catch (err) {
        res.status(500).send("Error fetching the user", err);
    }
});

// get all the users from the db
app.get('/feed', async (req, res) => {
    try{
        const users = await User.find({});
        if(!users.length) {
            res.status(500).send("No users found");
        }
        else {
            res.send(users);
        }
    } catch(err) {
        res.status(500).send("Error fetching users", err);
    }
});

//delete usre by id
app.delete('/user', async (req, res) => {
    try {
        const userId = req.query.id;
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (err) {
        res.status(500).send("Error deleting the user", err);
    }
});

//update data of a  user
app.patch('/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;
    //update user by id
    try{

        const ALLOWED_UPDATES = ['password', 'age', 'skills', 'about', 'profileUrl'];
        const requestedUpdates = Object.keys(data);
        const isValidOperation = requestedUpdates.every((update) => ALLOWED_UPDATES.includes(update));
        if(!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' });
        }
        const user = await User.findByIdAndUpdate(userId, data);
        res.send("User updated successfully");
    } catch(err) {
        res.status(500).send("Error updating the user", err);
    }

    // update user by email
    // try{
    //     const email = req.body.email;
    //     await User.findOneAndUpdate({email: email}, req.body);
    //     res.send("User updated successfully");
    // } catch(err) {
    //     res.status(500).send("Error updating the user", err);
    // }
});

connectDB().then(() => {
   console.log("DB connected");
   app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
}).catch((err) => {
    console.log("DB connection error", err);
});