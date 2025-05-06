// controllers/auth.controller.js
import jwt from "jsonwebtoken";

export const setToken = (req, res) => {
  const user = req.body;

  if (!user?.email) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const token = jwt.sign(user, process.env.ACCESS_SECRET_KEY, { expiresIn: "12h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  }).send({ success: true });
};

export const clearToken = (req, res) => {
  res.clearCookie("token", {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  }).send({ success: true });
};
