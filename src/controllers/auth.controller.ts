import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const _newUser = await client.user.create({
      data: { firstName, lastName, email, username, password: hashedPassword },
    });
    res.status(201).json({ message: "user created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  try {
    const user = await client.user.findFirst({
      where: {
        AND: [
          {
            OR: [{ email: identifier }, { username: identifier }],
          },
          {
            isDeleted: false,
          },
        ],
      },
    });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials!" });
      return;
    }
    const isSimilar = await bcrypt.compare(password, user.password);
    if (!isSimilar) {
      res.status(401).json({ message: "Invalid credentials!" });
      return;
    }
    const {
      password: userPassword,
      lastUpdated,
      createdAt,
      ...userInfo
    } = user;
    const token = jwt.sign(userInfo, process.env.JWT_SECRET!);
    res.status(200).json({ userInfo, token });
  } catch (_e) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
