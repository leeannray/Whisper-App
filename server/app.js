const express = require('express')
const app = express()
const PORT = 8000
// port for server

const customMiddleware = () => {
  console.log("in the middle")
}

app.get('/', (req, res) =>
{
  res.send("hey seussers")
})
// file path; get request. console.log for test

app.listen(PORT, ()=> {
  console.log('server listening hooray on', PORT)
}
)
// testing port 8000