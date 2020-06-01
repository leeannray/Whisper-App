module.exports={
    MONGOURI:'mongodb+srv://User:6MqaJUSPDa9qhEAG@cluster0-tnft4.mongodb.net/test?retryWrites=true&w=majority',
  JWT_SECRET: '193204271988121402081935lancrk',
    SENDGRID_API:process.env.SENDGRID_API,
  EMAIL: process.env.EMAIL
}

// // Atlas API uses HTTP Digest Authentication. It essentially requires a username and a password which are hashed using a unique server-generated value called a nonce. The username is the API public key and the password is the corresponding private key.
