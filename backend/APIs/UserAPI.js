import exp from "express";
import { register, authenticate } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const userRoute = exp.Router();

// Register user
userRoute.post("/users", async (req, res) => {
  // get user obj from req
  let userObj = req.body;
  // call register
  const newUserObj = await register({ ...userObj, role: "USER" });
  res.status(201).json({ message: "User created", payload: newUserObj });
});

// Read all aritcles(protected route)
userRoute.get("/articles",verifyToken("USER"), async (req, res) => {
    //read articles of all authors which are active
  const articles = await ArticleModel.find({ isArticleActive: true }).populate(
    "author",
    "firstName email",
  );
  // send res
  res.status(200).json({ message: "All articles", payload: articles });
});

// Add comment to an article(protected route)
userRoute.put('/articles', verifyToken("USER"), async (req, res) => {
    //get comment obj from req
        const { user,articleId,comment } = req.body;
        //check user
        console.log(req.user)
        if(user!==req.user.userId){
            return res.status(403).json({message:"Forbidden"})
        }
        //find articleby id and update
        let articleWithComment=await ArticleModel.findByIdAndUpdate(
            {_id:articleId,isArticleActive:true},
            { $push :{comments:{user,comment}}},
            {new:true,runValidators:true},
        )
        
        // if (!userId || !comment) {
        //     return res.status(400).json({ message: "All fields are required" });
        // }

        //if article not found
        if (!articleWithComment) {
            return res.status(404).json({ message: "Article not found" });
        }
        // send res
        res.status(200).json({
            message: "Comment added successfully",
            payload: articleWithComment
        });
});