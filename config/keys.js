if(process.env.NODE_ENV==='production') {
  module.exports = require('./prod')
}

else {
  module.exports = require('./dev')
}
// see setup for mongo db atlas and cloudinary