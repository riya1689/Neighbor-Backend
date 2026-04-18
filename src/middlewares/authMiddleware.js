import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { JWT_SECRET } from "../config/env.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    let token = "";

    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    } else {
      token = authHeader.trim();
    }

    if (!token) {
      const err = new Error("Unauthorized: token missing");
      err.statusCode = 401;
      return next(err);
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        neighborhoodId: true,
        createdAt: true
      }
    });

    if (!user) {
      const err = new Error("Unauthorized: user not found");
      err.statusCode = 401;
      return next(err);
    }

    req.user = user;
    return next();
  } catch (_error) {
    const err = new Error("Unauthorized: invalid token");
    err.statusCode = 401;
    return next(err);
  }
}

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const err = new Error("Forbidden: You do not have permission to perform this action");
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};

export default protect;

