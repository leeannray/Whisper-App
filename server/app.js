const express = require('express')
const app = express()
const PORT = 5000
// port for server

app.get('/', (req, res) =>
{
  res.send("hey seussers")
})

app.listen(PORT, ()=> {
  console.log('server listening hooray on', PORT)
}
)
// testing port 5000