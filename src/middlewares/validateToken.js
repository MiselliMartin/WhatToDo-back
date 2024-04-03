import { verifyToken } from "../services/jwt.service.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Access denied." });
  }
  const verifiedToken = verifyToken(token);
  if (!verifiedToken) {
    return res.status(401).json({ message: "Unauthorized. Access denied." });
  }
  const userId = verifiedToken.id;
  req.userId = userId;
  next();
};
