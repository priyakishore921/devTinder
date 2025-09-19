const express = require('express');
const requestRouter = express.Router();
const { UserAuth } = require('../middlewares/auth');

requestRouter.post('/connectionRequest', UserAuth, async (req, res) => {
    console.log("Sending connection request");

    res.send(`Connection request sent by ${req.user.firstName} `);
});

module.exports = requestRouter;