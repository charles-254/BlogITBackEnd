import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { UserPayload } from "../types";

const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (error: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (error) {
        res.status(401).json({ message: "Unauthorized. Invalid token." });
        return;
      }
      req.user = decoded as UserPayload;
      next();
    },
  );
};

export default verifyUser;
