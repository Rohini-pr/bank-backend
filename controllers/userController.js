// import model in userController.js
const users = require('../Models/userSchema')

// import jsonwebtoken
const jwt = require('jsonwebtoken')

// define and export logic to resolve different http client request

// register
exports.register = async (req,res)=>{
    // res.send("Register request recieved!!!")
    // register login
    console.log(req.body);

    // get data send by front end
    const {username,acno,password} = req.body
    if(!username || !acno || !password){
        res.status(403).json("All Inputs are required!!!")
    }

    // else{
    // res.send("Register request recieved!!!")
    // }

    // check user is an exist user
    try{
        // const response = await users.findOne({acno})
        // console.log(response);
        // res.json("register request recieved")
        const preuser = await users.findOne({acno})
        if(preuser){
            res.status(406).json("User already exist!!!!")
        }
        else{
            // add user to db
            const newuser = new users({
                username, 
                password,
                acno,
                balance:5000,
                transactions:[]
            })
            // to save newuser in mongodb
            await newuser.save()
            res.status(200).json(newuser)
        }
    }
    catch(error){
        res.status(401).json(error)
    }

}

// login
exports.login = async(req,res)=>{
    // get req body
    const{acno,password}=req.body

    
    try{
        // check acno and pswd is in db
        const preuser = await users.findOne({acno,password})
        // check preuser or not
        if(preuser){
            // generate token using jwt
            const token = jwt.sign({
                loginAcno:acno
            },"supersecretkey12345")
            // send to client
            res.status(200).json({preuser,token})
        }
        else{
            res.status(404).json("Invalid account number / password")
        }
    }
    catch(error){
        res.status(401).json(error)
    }

}
// getbalance
exports.getbalance = async(req,res)=>{
    // get acno from path parameter
    let acno =req.params.acno
    // get data of given acno
    try{
        // find acno from users collection
        const preuser = await users.findOne({acno})
        // check preuser or not
        if(preuser){
            res.status(200).json(preuser.balance)
        }
        else{
            res.status(404).json("Invalid Account number !!!")
        }
    }
    catch(error){
        res.status(401).json(error)
    }

}

// transfer
exports.transfer =async(req,res)=>{
    console.log("Inside transfer logic");
    // logic
    // 1.get body from req, creditacno, amt, pswd
    const {creditAcno,creditAmount,pswd} = req.body
    // covert creditAmount to number
    let amt = Number(creditAmount)
    
    const {debitAcno} = req
    console.log(debitAcno);
    try{
        // 2.check debit acno n pswd is available in mongodb
        const debitUserDetails = await users.findOne({acno:debitAcno,password:pswd})
        console.log(debitUserDetails);

        // 3.get credit acno details from mongo db
        const creditUserDetails = await users.findOne({acno:creditAcno})
        console.log(creditUserDetails);

        if(debitAcno!=creditAcno){

            if(debitUserDetails && creditUserDetails){

                // check sufficient balance available for debitUserDetails
                if(debitUserDetails.balance>=creditAmount){
    
                    // perform transfer
                    // debit creditAmount from debitUserDetails
                    debitUserDetails.balance-=amt
    
                    // add debit transaction to debitUserDetails
                    debitUserDetails.transactions.push({
                        transaction_type:"DEBIT",amount:creditAmount,fromAcno:debitAcno,toAcno:creditAcno
                    })
    
                    // save debitUserDetails in mongodb
                    await debitUserDetails.save()
    
                    // credit creditAmount to creditUserDetails
                    creditUserDetails.balance+=amt
    
                    // add credit transaction to debitUserDetails
                    creditUserDetails.transactions.push({
                        transaction_type:"CREDIT",amount:creditAmount,fromAcno:debitAcno,toAcno:creditAcno
                    })
    
                    // save creditUserDetails in mongodb
                    await creditUserDetails.save()
                    res.status(200).json("Fund Transfer successfully completed....")
    
    
                }
                else{
                    // Insufficient
                    res.status(406).json("Insufficient balance!!!")
                }
    
            }
            else{
                res.status(406).json("Invalid credit / debit details!!!")
            }

        }
        else{
            res.status(406).json("Operation Denied!!! Self transaction are not allowed....")
        }


        
        
    }
    catch(error){
        res.status(401).json(error)
    }
    // res.send("transfer request recieved")

}

// getTransactions
exports.getTransactions = async (req,res)=>{
    // 1. get acno from req.debitAcno
    let acno = req.debitAcno

    try {
        // 2. check acno in mongo db
        const preuser = await users.findOne({acno})
        res.status(200).json(preuser.transactions)
    } 
    catch(error){
        res.status(401).json("Invalid Account Number")
    }
}

// deleteMyAcno
exports.deleteMyAcno = async (req,res)=>{
    // 1. get acno from req
    let acno = req.debitAcno 

    // remove acno from db
    try{
        await users.deleteOne({acno})
        res.status(200).json("Removed Successfully")
    }
    catch(error){
        res.status(401).json(error)
    }
}
