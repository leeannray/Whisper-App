const express = require('express')
const app = express()
const PORT = 5000
// port for server

app.get('/', (req, res) =>
{
  res.send("hey seussers")
})
// file path; get request. console.log for test

app.listen(PORT, ()=> {
  console.log('server listening hooray on', PORT)
}
)
// testing port 5000