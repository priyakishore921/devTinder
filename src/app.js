const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { UserAuth } = require('./middlewares/auth');

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);

connectDB().then(() => {
   console.log("DB connected");
   app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
}).catch((err) => {
    console.log("DB connection error", err);
});