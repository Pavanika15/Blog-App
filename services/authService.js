import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../models/UserModel.js";
import {config} from 'dotenv'
config()

export const register = async (userObj) => {
  // create document
  const userDoc = new UserTypeModel(userObj);
  // validate for empty passwords
  await userDoc.validate();
  // hash and replace plain password
  userDoc.password = await bcrypt.hash(userDoc.password, 10);
  //save
  const created = await userDoc.save();
  // convert document to object to remove password
  const newUserObj = created.toObject();
  // remove password
  delete newUserObj.password;
  // return user obj without password
  return newUserObj;
};

export const authenticate = async ({ email, password }) => {
  // check user with email & role
  const user = await UserTypeModel.findOne({ email });
  if (!user) {
    const err = new Error("Invalid email");
    err.status = 401;
    throw err;
  }

  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    throw err;
  }
  // check whether account blocked or not
  if(user.isActive===false){
    const err=new Error("Your account blocked, Plz contact admin")
    err.status=403
    throw err
  }
  // generate token
  const token = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  const userObj=user.toObject()
  delete userObj.password
  return {token,user:userObj}
};
