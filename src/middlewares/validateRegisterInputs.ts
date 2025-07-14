import { Request, Response, NextFunction } from "express";

const validateRegisterInput = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { firstName, lastName, username, password, email } = req.body;

  if (!firstName) {
    res.status(400).json({ message: "First name is required." });
    return;
  }
  if (!lastName) {
    res.status(400).json({ message: "Last name is required." });
    return;
  }
  if (!username) {
    res.status(400).json({ message: "Username is required." });
  }
  if (!email) {
    res.status(400).json({ message: "Email is required." });
  }
  if (!password) {
    res.status(400).json({ message: "Password is required" });
  }
  next();
};

export default validateRegisterInput;
