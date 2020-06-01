const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model("User");

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    //authorization === Bearer Key
    if (!authorization) {
        return res.status(401).json({ error: "You must be checked in!" });
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be checked in!" });
        }

        const { _id } = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
            next();
            // skips to next middleware
        });
    });
}

// REDUX: Actions are payloads of information that send data from your application to your store. They are the only source of information for the store. You send them to the store using store.dispatch().

// Actions are plain JavaScript objects. Actions must have a type property that indicates the type of action being performed. Types should typically be defined as string constants. Once your app is large enough, you may want to move them into a separate module.
