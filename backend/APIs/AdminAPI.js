import exp from 'express'
import { ArticleModel } from '../models/ArticleModel.js'
import {UserTypeModel} from '../models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import {checkAdmin} from '../middlewares/checkAdmin.js'

export const adminRoute=exp.Router()


// Read all articles
adminRoute.get('/articles',verifyToken,checkAdmin,async(req,res)=>{
    let articles=await ArticleModel.find({isArticleActive:true}).populate('author','name email')
    res.status(200).json({message:" All Articles",payload:articles})
})


// Block user roles
adminRoute.post('/block-user',verifyToken,checkAdmin,async(req,res)=>{
    const {userId}=req.body
    // Logic to block the user with the given userId
    let userOfDB = await UserTypeModel.findById(userId)

      // if article not found
      if (!userOfDB) {
        return res.status(404).json({ message: "User not found" });

      }
      // if already blocked
      if (!userOfDB.isActive) {
        return res.status(400).json({ message: "User already blocked" });
      }

      let updatedUser=await UserTypeModel.findByIdAndUpdate(
        userId,
        {
            $set:{isActive:false}
        },
        {new:true}
      )
    res.status(200).json({message:`User with ID ${userId} has been blocked.`,payload:updatedUser})
})

// Unblock user roles
adminRoute.post('/unblock-user',verifyToken,checkAdmin,async(req,res)=>{
    const {userId}=req.body
    // Logic to unblock the user with the given userId
    let userOfDB = await UserTypeModel.findById(userId)

      // if article not found
      if (!userOfDB) {
        return res.status(404).json({ message: "User not found" });

      }
      // if already unblocked
      if (userOfDB.isActive) {
        return res.status(400).json({ message: "User already unblocked" });
      }

      let updatedUser=await UserTypeModel.findByIdAndUpdate(
        userId,
        {
            $set:{isActive:true}
        },
        {new:true}
      )
    res.status(200).json({message:`User with ID ${userId} has been unblocked.`,payload:updatedUser})
})