import { Request } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    userInfo: jwt.JwtPayload | string | undefined;
  }
}
