const express = require('express');
// using router inbult in express
const router = express.Router();

// connecting mongoose to add user id and password
const mongoose = require('mongoose');
// getting schema from mongoose
const User = mongoose.model("User");

// adding bcryptjs
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// adding JSONwebToken for secure password
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

// adding middleware to verify token
const requireLogin = require('../middleware/requireLogin');
//

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: SENDGRID_API
    }
}))

// getting data is request body
router.post('/signup', (req, res) => {
    console.log(req.body);
    
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please fill all the fields." });
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists with this email." });
            }
            bcrypt.hash(password, 20)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic
                    });

                    user.save()
                        .then(user => {
                            // transporter.sendMail({
                            //     to:user.email,
                            //     from:"no-reply@insta.com",
                            //     subject:"signup success",
                            //     html:"<h1>welcome to instagram</h1>"
                            // })
                            res.json({ message: "User saved successfully, now please log in again." })
                        })
                        // if any error
                        .catch(err => {
                            console.log(err);
                        });
                });
        })
        // if any error at the end
        .catch(err => {
            console.log(err);
        });
});

// User sign in routes with JSWwebToken
router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password." });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email or password! Please try again." });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({message:"Successfully signed in!"})
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({ token, user: { _id, name, email, followers, following, pic } });
                    }
                    else {
                        return res.status(422).json({ error: "Invalid email or password! Please try again." });
                    }
                })
                .catch(err => {
                    console.log(err)
                });
        });
});



module.exports = router