import exp from "express";
import { register, authenticate } from "../services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { checkAuthor } from "../middlewares/chechAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";
export const authorRoute = exp.Router();

// Register author(public)
authorRoute.post("/users", async (req, res) => {
  // get user obj from req
  let userObj = req.body;
  // call register
  const newUserObj = await register({ ...userObj, role: "AUTHOR" });
  res.status(201).json({ message: "Author created", payload: newUserObj });
});

// Create article(protected route)
authorRoute.post("/articles",verifyToken, checkAuthor, async (req, res) => {
  //get article from req
  let article = req.body;
  // // check for the author
  // let author=await UserTypeModel.findById(article.author)
  // if( !author || author.role!=="AUTHOR")
  // {
  //     return res.status(401).json({message:"Invalid authors"})
  // }
  // create article document
  let newArticleDoc = new ArticleModel(article);
  // save
  let createdArticleDoc = await newArticleDoc.save();
  // send res
  res
    .status(200)
    .json({ message: "Article created", payload: createdArticleDoc });
});

// Read articles of author(protected route)
authorRoute.get("/articles/:authorId",verifyToken, checkAuthor, async (req, res) => {
  //get author id
  let aid = req.params.authorId;
  // // check the author
  // let author=await UserTypeModel.findById(aid)
  // if( !author || author.role!=="AUTHOR")
  // {
  //     return res.status(401).json({message:"Invalid authors"})
  // }
  // read articles by this author which are active
  let articles = await ArticleModel.find({
    author: aid,
    isArticleActive: true,
  }).populate("author", "firstName email");
  // send res
  res
    .status(200)
    .json({ message: "Articles of the author", payload: articles });
});

// Edit article(protected route)
authorRoute.put("/articles",verifyToken, checkAuthor, async (req, res) => {
  // get modified article from req
  let { articleId, title, category, content, author } = req.body;
  //find article
  let articleOfDB = await ArticleModel.findOne({
    _id: articleId,
    author: author,
  });
  // if article not found
  if (!articleOfDB) {
    return res.status(401).json({ message: "Article not found" });
  }
  //check the article is published by the author received from client
  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { title, category, content },
    },
    { new: true },
  );
  // update the article
  //  send res
  res.status(200).json({ message: "Article updated", payload: updatedArticle });
});

// Delete(soft delete) article(protected route)
authorRoute.put("/articles/:articleId",verifyToken, checkAuthor, async (req, res) => {  
  // get articleId from params
    const { articleId } = req.params;
    // get authorId from token
    const authorId = req.user._id;

  // find article
  const articleOfDB = await ArticleModel.findOne({
    _id: articleId,
    author: authorId,
  });
  // if article not found
  if (!articleOfDB) {
    return res.status(401).json({ message: "Article not found" });
  }
  const updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { isArticleActive: false },
    },
    { new: true },
  );
  res.status(200).json({ message: "Article deleted", payload: updatedArticle });
});
