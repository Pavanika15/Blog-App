import { UserTypeModel } from "../models/UserModel.js";
export const checkAdmin = async (req, res, next) => {

  const adminId = req.user?._id;

  if (!adminId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const admin = await UserTypeModel.findById(adminId);

  if (!admin) {
    return res.status(401).json({ message: "Invalid admin" });
  }

  if (admin.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  if (!admin.isActive) {
    return res.status(403).json({ message: "Admin account is blocked" });
  }

  next();
};