require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const app = express()

//Config JSON response
app.use(express.json())

//Models
const User = require('../models/User')

//Public Open Route
app.get('/', (req, res) =>{
    res.status(200).json({msg:'Welcome to API Futset'})
})

//Register Route
app.post('/auth/register', async(req, res)=>{
    const {name, email, password, confirm_password} = req.body

    //Validations
    if(!name){
        return res.status(422).json({msg:'Empty name'})
    }

    if(!email){
        return res.status(422).json({msg:'Empty email'})
    }

    if(!password){
        return res.status(422).json({msg:'Empty password'})
    }

    if(password !== confirm_password){
        return res.status(422).json({msg:'Passwords are not the same'})
    }

    const userExists = await User.findOne({email:email})

    if(userExists){
        
        return res.status(422).json({msg:'email already registered'})
        
    }

    const salt= await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)
    
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try{
        
        await user.save()

        res.status(201).json({msg:'User successfully registered', user})
       
    }catch(error){
        res.status(500).json({msg: 'Something is wrong!'})
    }

})

//Login User

app.post('/auth/login', async(req, res)=>{

    const {email, password} = req.body

    //VAlidations
    if(!email){
        return res.status(422).json({msg:'Empty email'})
    }

    if(!password){
        return res.status(422).json({msg:'Empty password'})
    }

    //Check if user exists
    const user = await User.findOne({email:email})

    if(!user){
        
        return res.status(404).json({msg:'User not found'})   
    }

    //check if password match
    const checkPassword  = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(422).json({msg:'Wrong password'})   
    }

    res.status(200).json({msg:'User Logged', user})

})

//Credencials
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@fut-set.hcuphse.mongodb.net/?retryWrites=true&w=majority`).then(() =>{
    app.listen(process.env.PORT)
    console.log('You are connected in database!')
}).catch((err) => console.log(err))

