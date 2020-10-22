const express = require('express')
const cors = require ('cors')
const mongoose = require('mongoose')
const routes = require('./routes/index')
const app = express()


require('dotenv').config();
const port = process.env.PORT;
app.use(express.json());
app.use(cors())
app.use(routes)

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

const db = mongoose.connection
db.on('error', error=>console.log(error))
db.once('open', ()=>console.log("connected to database"))

app.listen(port, ()=>{
  console.log('Api is live in port', port)
})