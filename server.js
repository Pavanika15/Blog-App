import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { userRoute } from "./APIs/UserAPI.js";
import { authorRoute } from "./APIs/AuthorAPI.js";
import { adminRoute } from "./APIs/AdminAPI.js";
import { commonRoute } from "./APIs/CommonAPI.js";
import cookieParser from "cookie-parser";
config(); // process.env gives all environmental variables

const app = exp();
// add body parser middleware
app.use(exp.json());
// add cookie parser middleware
app.use(cookieParser())

// connect APIs
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRoute);

// connect to db
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("DB connection success");
    // strat http server
    app.listen(process.env.PORT, () => console.log("server started"));
  } catch (err) {
    console.log("Error in DB connection", err);
  }
};
connectDB();

// dealing with invalid path
app.use(( req, res) => {
  res.json({ message: `${req.url} is Invalid path`});
});


// error handling middleware
app.use((err, req, res, next) => {
  console.log("err:", err);
  res.json({ message: "error", reason: err.message });
});
