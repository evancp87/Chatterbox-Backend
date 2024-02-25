import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TUser } from "../types/types";
const jwtSecret = process.env.SUPABASE_JWT_SECRET!;

interface AuthenticatedRequest extends Request {
  token?: string;
  user?: TUser;
}

const checkToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization!;

  if (!token) {
    res.status(403).json({ error: "error, you are not authorized" });
  }
  jwt.verify(token, jwtSecret, (error, decoded) => {
    if (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decoded as TUser;
    next();
  });
};

export default checkToken;
