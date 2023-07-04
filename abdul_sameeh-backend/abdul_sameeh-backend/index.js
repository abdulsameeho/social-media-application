const express = require('express')
const app = express()
const PORT = 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./mongokey')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


 

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log('Database connected')
})
mongoose.connection.on('error',(err)=>{
    console.log('Failed to connecting',err)
})

require('./models/user')
require('./models/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))




app.listen(PORT,()=>{
    console.log('server is running on', PORT);
})
