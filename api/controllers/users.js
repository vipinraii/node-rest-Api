const mongoose =require('mongoose');
const User =require('../models/user');

const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
exports.users_signup=(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length>=1){
            return res.status(422).json({
                message:"Mail exists"
            })
        }else{
           bcrypt.hash(req.body.password,10,(err,hash)=>{
               if(err){
                   return res.status(500).json({
                        error:err
                    })
               }else{
                  const user=new User({
                      _id:mongoose.Types.ObjectId(),
                      email:req.body.email,
                      password:hash
                  });
                  user.save()
                  .then(result =>{
                      console.log(result),
                      res.status(201).json({
                          message:"User Created"
                      })
                  })
                  .catch(err =>{
                      console.log(err)
                      res.status(500).json(({
                          error:err
                      }))
                  });
               }
          })
        }
    })
   
}
exports.users_login =(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({
                message:'Auth Fail'
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                console.log(err)
                return res.status(401).json({
                    message:'Auth Fail'
                })
            }
            if(result){
                const token=jwt.sign({
                    email:user[0].email,
                    userId:user[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn:"1h"
                }
                );
                return res.status(201).json({
                    message:'Auth Successful',
                    token:token
                })
            }
            res.status(401).json({
                message:'Auth Fail'
            })
        })

    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    });
       
}

exports.user_delete=(req,res,next)=>{
    User.remove({_id:req.params.userId})
        .exec()
        .then(result=>{
            return res.status(200).json({
                message:"User Deleted"
            })
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
                error:err
            })
        });
        }