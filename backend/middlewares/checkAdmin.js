import { UserTypeModel } from "../models/UserModel.js";
export const checkAdmin=async(req,res,next)=>{
//get adminid
    let id=req.body?.admin || req.params.adminId
    //verify admin
    let admin=await UserTypeModel.findById(id);
    if(!admin){
        return res.status(401).json({message:"Invalid Admin"})
    }
    //if admin found but role is diff
    if(admin.role!=='ADMIN'){
        return res.status(403).json({message:"User is not an Admin"});
    }   
    //forward the req to next
    next();
}