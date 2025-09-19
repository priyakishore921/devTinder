const jwt = require('jsonwebtoken');
const User = require('../models/user');

const UserAuth = async (req, res, next) => {
    try {
        // validate the cookie
        const { token } = req.cookies;
        if(!token) {
            throw new Error('Token not valid');
        }

        const { _id } = jwt.verify(token, "FirstJWTSecret");

        const user = await User.findById(_id);

        if(!user) {
            throw new Error('Invalid user');
        }
        
        req.user = user;
        next();
    }
    catch(err) {
        return res.status(401).send("Unauthorized "+ err.message);
    }
}

module.exports = {
    UserAuth
}