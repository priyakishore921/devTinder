const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { UserAuth } = require('./middlewares/auth');

const authRouter = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);

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