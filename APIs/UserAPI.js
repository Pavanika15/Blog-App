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

// Read all aritcles
let articleList = [];
userRoute.get("/articles", async (req, res) => {
  let articles = await ArticleModel.find({ isArticleActive: true }).populate(
    "author",
    "firstName email",
  );
  res.status(200).json({ message: "All articles", payload: articles });
});

// Add comment to an article
userRoute.post('/articles/:articleId/comments', verifyToken, async (req, res) => {
        const { articleId } = req.params;
        const { userId, comment } = req.body;
        if (!userId || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const updatedArticle = await ArticleModel.findByIdAndUpdate(
            articleId,
            {
                $push: {
                    comments: {
                        user: userId,
                        comment: comment
                    }
                }
            },
            { new: true }
        ).populate("comments.user", "username email");

        if (!updatedArticle) {
            return res.status(404).json({ message: "Article not found" });
        }

        res.status(200).json({
            message: "Comment added successfully",
            payload: updatedArticle
        });
});