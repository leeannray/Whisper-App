const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const mongoose  = require('mongoose')
// port for server: DEFAULT IS PORT 3000 -->
const {MONGOURI} = require('./config/keys')


mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
// mongo db atlas

mongoose.connection.on('connected', () => {
  console.log("In the middle…")
})

mongoose.connection.on('error', (err )=> {
  console.log("Grrrr...not working…",err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


if(process.env.NODE_ENV == "production") {
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}



