import {UserTypeModel} from '../models/UserModel.js'
export const checkAuthor=async(req,res,next)=>{
    //get author id
    let aid=req.body?.author || req.params?.authorId
    //verify author
    let author=await UserTypeModel.findById(aid)
    // if author not found
    if( !author)
    {
        return res.status(401).json({message:"Invalid authors"})
    }
    // if author found but roleis different
    if(author.role!=="AUTHOR"){
        return res.status(403).json({message:"User is not Author"})
    }
    // if author is blocked
    if(!author.isActive){
        return res.status(403).json({message:"Author account is not active"})
    }
    // forward request to next
    next()
}