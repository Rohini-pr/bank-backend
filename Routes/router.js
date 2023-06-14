// import express
const express = require('express')

// import middleware
const middleware = require('../Middleware/routerSpecific')


// create routes, using express.Router() class, object
const router = new express.Router()

// import controller
const userController = require('../controllers/userController')

// define routes to resolve http request

// register rqst
router.post('/employee/register',userController.register)

// login
router.post('/employee/login',userController.login)

// getbalance rst
// router.get('/user/balance/:acno',userController.getbalance)
router.get('/user/balance/:acno',middleware.logMiddleware,userController.getbalance)

// user/transfer
router.post('/user/transfer',middleware.logMiddleware,userController.transfer)

// user/ministatement
router.get('/user/ministatement',middleware.logMiddleware,userController.getTransactions)

// delete account
router.delete('/user/delete',middleware.logMiddleware,userController.deleteMyAcno)

// export router
module.exports = router