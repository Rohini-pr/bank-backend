// define application specific middleware
const appMiddleware = (req,res,next)=>{
    console.log("Application Specific Middleware");
    next()
}

module.exports={
    appMiddleware
}