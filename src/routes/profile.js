const express = require('express');
const profileRouter = express.Router();
const { UserAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validate');

profileRouter.get('/profile/view', UserAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    }
    catch(err) {
        res.status(500).send("Error fetching profile"+ err.message);
    }
});

profileRouter.patch('/profile/edit', UserAuth, async (req, res) => {
    try{
        if (!validateEditProfileData(req.body)) {
            throw new Error('Invalid fields in edit profile request');
        }
        const user = req.user;
        Object.keys(req.body).forEach(key => user[key] = req.body[key]);
        
        await user.save();
        res.send("Profile updated successfully");
    }
    catch(err) {
        res.status(400).send("ERROR: "+ err.message);
    }
});

module.exports = profileRouter;
