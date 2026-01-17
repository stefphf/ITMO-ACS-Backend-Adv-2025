import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Request, Response, NextFunction } from "express";
import SETTINGS from "../config/settings";
import jwt = require("jsonwebtoken");

const JWT_SECRET = SETTINGS.JWT_SECRET_KEY;

export interface AuthRequest extends Request {
    user?: {userId: number};
}

@Middleware({ type: "before" })
export class AuthMiddleware implements ExpressMiddlewareInterface {
  use(request: AuthRequest, response: Response, next: NextFunction): any {
    const authHeader = request.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return response.status(401).json({ detail: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      request.user = payload as {userId: number;};
      next();
    } catch (err) {
      return response.status(401).json({ detail: "Invalid or expired token" });
    }
  }
}