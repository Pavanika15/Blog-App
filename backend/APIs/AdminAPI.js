import exp from 'express';
import { checkAdmin } from '../middlewares/checkAdmin.js';
import { UserTypeModel } from '../models/UserModel.js';

export const adminRoute=exp.Router();

//Block user roles
adminRoute.post("/blockuser/:adminId",checkAdmin,async(req,res)=>{
    //get userId
    let {userId}=req.body;
    //find user
    let userofDB=await UserTypeModel.findOne({_id:userId});
    if(!userofDB){
        return res.status(401).json({message:"User not found"});
    }
    let blockeduser=await UserTypeModel.findByIdAndUpdate(
        userId,
        {
            $set:{isActive:false}
        },
        {new:true}
    );
    //send res
    res.status(200).json({message:"User blocked",payload:blockeduser});
})   

//Unblock user roles
adminRoute.post("/unblockuser/:adminId",checkAdmin,async(req,res)=>{
    //get userId
    let {userId}=req.body;
    //find user
    let userofDB=await UserTypeModel.findOne({_id:userId});
    if(!userofDB){
        return res.status(401).json({message:"User not found"});
    }
    let unblockeduser=await UserTypeModel.findByIdAndUpdate(
        userId,
        {
            $set:{isActive:true}
        },
        {new:true}
    );
    //send res
    res.status(200).json({message:"User unblocked",payload:unblockeduser});
})   