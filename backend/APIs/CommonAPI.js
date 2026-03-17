import exp from "express";
import { authenticate } from "../services/authService.js";
import bcrypt from "bcryptjs";
import { UserTypeModel } from "../models/UserModel.js";
export const commonRoute = exp.Router();

//login
commonRoute.post("/login", async (req, res) => {
  // get user credential object
  let userCred = req.body;
  // call authenticate service
  let { token, user } = await authenticate(userCred);
  // save token as httpOnly token
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  // send res
  res.status(200).json({ message: "login success", payload: user });
});

// logout for User,Author and Admin
commonRoute.post("/logout", (req, res) => {
  // clear the cookie named 'token'
  res.clearCookie("token", {
    httpOnly: true, // Must match original set settings
    secure: false,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// change password(protected route)
commonRoute.put("/change-password", async (req, res) => {
  // get current password and new password
  const { email, currentPassword, newPassword } = req.body;

  // prevent same password
  if(currentPassword===newPassword){
    return res.status(400).json({message:"newPassword must be different from currentPassword"})
  }
  // // Validate input
  // if (!email || !currentPassword || !newPassword) {
  //   return res.status(400).json({ message: "All fields are required" });
  // }

  // Find user by email (works for USER, AUTHOR, ADMIN - all same collection)
  const account = await UserTypeModel.findOne({ email });
  if (!account) {
    return res.status(404).json({ message: "Account not found" });
  }

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  // Hash and save new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // // Update password
  // await UserTypeModel.findOneAndUpdate(
  //   { email },
  //   { $set: { password: hashedPassword } },
  //   { new: true },
  // );

  await 
  res.status(200).json({ message: "Password changed successfully" });
});
