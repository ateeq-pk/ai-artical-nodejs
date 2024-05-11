require('dotenv').config()

const cors = require('cors');

const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const historyRoutes = require('./routes/history')

// express app
const app = express()

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());
app.get('/',(req,res)=>{
  res.status(200).send('<h1>Hello Azeem cake</h1>')
})
app.use('/', userRoutes)
app.use('/history', historyRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })
