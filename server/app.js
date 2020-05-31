const express = require('express')
const app = express()
const PORT = 5000

app.get('/', (req, res) =>
{
  res.send("hey seussers")
})

app.listen(PORT, ()=> {
  console.log('server listening hooray')
}