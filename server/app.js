const express = require('express')
const app = express()
const PORT = 8000
// port for server: DEFAULT IS PORT 3000 --> RUNNING

const customMiddleware = (req, res, next) => {
  console.log("in the middle")
  // middleware modify request (user) before reaching route handler
  next()
  // execute prior MW or next MW. request to / route

  // try server
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