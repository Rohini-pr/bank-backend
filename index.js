// import
// config:Loads .env file contents into process.env.
require('dotenv').config();

// import express
const express = require('express')



// import cors
const cors = require('cors')

// import db
require('./db/connection')

// import router
const router = require('./Routes/router')

// import appmiddleware
const middleware = require('./Middleware/appMiddleware')

// Create express server
const server = express()

// setup port number for server
const PORT = 3000 || process.env.PORT

// use cors,json parser in server app
server.use(cors())
server.use(express.json())

// use appmiddleware
server.use(middleware.appMiddleware)

// use router in server app
server.use(router)

// to resolve http request using express server
server.get('/',(req,res)=>{
    res.send(` <h2>Bank server Started!!!</h2> `)
})

// run the server app in a specified port
server.listen(PORT,()=>{
    console.log(`Bank Server Started at port number ${PORT}`);
})
