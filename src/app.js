const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
    const user = new User(req.body);

    // persist the user in db
    try {
        await user.save();
        res.status(201).send("User succesfully created");
    } catch (err) {
        res.status(400).send("Error saving the user", err);
    }
});

connectDB().then(() => {
   console.log("DB connected");
   app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
}).catch((err) => {
    console.log("DB connection error", err);
});