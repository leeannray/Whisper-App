const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
// keys set up --> must be long --> many numbers/letters (check exact?)
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    // authorization === Bearer ewefwegwrherhe
    if(!authorization) {
       return res.status(401).json({ error:"Check in please!" })
    }

    const token = authorization.replace("Bearer", "")
    
    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if(err) {
         return res.status(401).json({ error: "Not so fast! Please check-in at reception…" })
        }

        const { _id } = payload
        // payload
        User.findById(_id).then(userdata => {
            req.user = userdata
            next()
            // shifts to next middleware
        })
    })
}