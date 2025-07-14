import { Request, Response, NextFunction } from "express";
import zxcvbn from "zxcvbn";

const verifyPasswordStrength = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password } = req.body;
  try {
    const results = zxcvbn(password);

    if (results.score < 3) {
      res.status(400).json({ message: "Please use a stronger password." });
      return;
    }
    next();
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export default verifyPasswordStrength;
