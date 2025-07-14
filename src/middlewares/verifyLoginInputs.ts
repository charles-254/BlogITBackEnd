import { Request, Response, NextFunction } from "express";

const verifyLoginInputs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { identifier, password } = req.body;

  if (!identifier) {
    res.status(400).json({ message: "Email or Username required." });
    return;
  }
  if (!password) {
    res.status(400).json({ message: "Password is required" });
    return;
  }
  next();
};

export default verifyLoginInputs;
