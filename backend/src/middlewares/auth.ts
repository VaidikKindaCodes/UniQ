import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserRole } from "../modules/auth/user.model.js";

export interface JwtUserPayload extends JwtPayload {
  sub: string;
  role: UserRole;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}

// Middleware to verify JWT token and attach user to request
export const verifyJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtUserPayload;
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

//A middleware that checks if the authenticated user has one of the allowed roles

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // ROOT ADMIN OVERRIDE — configurable via ROOT_ADMIN_EMAIL env var
      if (
        allowedRoles.includes("admin") &&
        env.ROOT_ADMIN_EMAIL &&
        req.user.email === env.ROOT_ADMIN_EMAIL
      ) {
        return next();
      }

      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }

    return next();
  };
};
