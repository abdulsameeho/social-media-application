const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../mongokey')
 

router.post('/signup',(req,res)=>{
    const {name, email, password,pic} = req.body
    if(!email || !password ||!name){
      return res.status(422).json({error:"Please fill all fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exists with that email"})
        }

            bcrypt.hash(password, 10)
            .then(hashedpassword =>{

                const user = new User({
                    email,
                    password:hashedpassword,
                    name,
                    pic
                })
                user.save()
                .then(user => {
                    res.json({message:"saved sucessfully"})
                })
                .catch(err =>{
                    console.log(err);
                })

            })


           
    })
    .catch(err =>{
        console.log(err);
    })
    
})

router.post('/login',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:'Please enter the email or password'})
    }
    User.findOne({email:email})
    .then(savedUser =>{
        if(!savedUser){
          return res.status(422).json({error:'Invalid email or password'})
        }
        bcrypt.compare(password,savedUser.password)
        .then(domatch =>{
            if(domatch){
               
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const { _id, name, email, pic, followers,following } = savedUser;
                res.json({
                  token,
                  user: { _id, name, email, pic, followers, following },
                });
            }else{
                return res.status(422).json({error:'Invalid password'})
            }
        })
        .then(err =>{
            console.log(err);
        })
    })
})





module.exports = router