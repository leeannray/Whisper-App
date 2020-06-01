//connecting express
const express = require('express');
const router = express.Router();

//mongodb
const mongoose = require('mongoose')
const User = mongoose.model("User")

//bcrypt js
const bcrypt = require('bcryptjs')
//jwt for token
//key is in env file
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')

//middleware
const requireLogin = require('../middleware/requireLogin')

//sign up route to signup 
router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    //email
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exists with that email" });
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name,
                        pic
                    });
    
                    user.save()
                        .then(user => {
                            res.json({ message: "saved successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                        });
                });
     
        })
        .catch(err => {
            console.log(err);
        });
});


//sign in user 
//get email and password that user type through req.body
//status 422 is something make server stop
router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        //bcrypt check password
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
               const {_id,name,email,followers,following,pic} = savedUser
               res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})



module.exports = router