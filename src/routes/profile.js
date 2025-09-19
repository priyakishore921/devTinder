const express = require('express');
const profileRouter = express.Router();
const { UserAuth } = require('../middlewares/auth');

profileRouter.get('/profile', UserAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch(err) {
        res.status(500).send("Error fetching profile"+ err.message);
    }
});

module.exports = profileRouter;
