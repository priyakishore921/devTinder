const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

app.use(express.json());

app.post('/signup', async (req, res) => {
    const user = new User(req.body);
    console.log(req.body);

    // persist the user in db
    try {
        await user.save();
        res.status(201).send("User succesfully created");
    } catch (err) {
        res.status(400).send("Error saving the user"+ err.message);
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