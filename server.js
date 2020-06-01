const express = require('express');
const app = express();
// PORT
const PORT = 3001;
// Mongo DB
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');

mongoose.connect(MONGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', ()=>{
    console.log('Database connected');
});
mongoose.connection.on('error', (error)=>{
    console.log('Database NOT connected', error);
});

// Models to add schema
require('./models/user');
require('./models/post');

// Routes to add middleware
app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));



app.listen(PORT, () => {
    console.log("server is running on ", PORT);
})