import type { Request, Response } from "express";
import type { JwtPayload, VerifyErrors } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response) {
  const { token } = req.body;
  if (!token)
    return res.status(400).json({
      message: "Bad Request: token is missing",
    });

  if (process.env.JWT_SECRET_KEY) {
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      (err: VerifyErrors | null, payload: string | JwtPayload | undefined) => {
        if (err)
          return res.status(400).json({
            message: "Invalid token",
          });
        res.status(200).json({
          message: "The token is valid !",
        });
      },
    );
  }
}
