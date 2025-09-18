const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { UserAuth } = require('./middlewares/auth');

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

        const isPasswordMatch = user.validatePassword(password);
        if(!isPasswordMatch) {
            return res.status(400).send("Invalid credentials");
        }

        const token = await user.getJWT();

        res.cookie("token", token, {expires: new Date(Date.now() + 7*3600000), httpOnly: true});
        res.send("User logged in successfully");
    }
    catch(err) {
        res.status(500).send("Error logging in the user"+ err.message);
    }
})

app.get('/profile', UserAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch(err) {
        res.status(500).send("Error fetching profile"+ err.message);
    }
});

app.post('/connectionRequest', UserAuth, async (req, res) => {
    console.log("Sending connection request");

    res.send(`Connection request sent by ${req.user.firstName} `);
});

connectDB().then(() => {
   console.log("DB connected");
   app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
}).catch((err) => {
    console.log("DB connection error", err);
});