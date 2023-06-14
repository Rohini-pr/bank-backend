// define node 
// import mongoose in connection.js file
const mongoose = require('mongoose')
// to get connection string from .env file : process.env
const connectionString = process.env.DATABASE

mongoose.connect(connectionString,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("MongoDB Atlas Conneced Successfully...");
}).catch((error)=>{
    console.log("MongDB Connection Error!!:"+error);
})





