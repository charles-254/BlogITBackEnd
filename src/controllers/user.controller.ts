import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";

const client = new PrismaClient();

export const getUserBlogs = async (req: Request, res: Response) => {
  const { id } = req.user;
  try {
    const userBlogs = await client.blog.findMany({
      where: {
        AND: [{ userId: id }, { isDeleted: false }],
      },
    });
    res.status(200).json({ userBlogs });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  const { id } = req.user;
  const { firstName, lastName, username, email, profileImageUrl } = req.body;

  try {
    const userDetails: any = {};

    if (firstName && firstName !== "") {
      userDetails.firstName = firstName;
    }

    if (lastName && lastName !== "") {
      userDetails.lastName = lastName;
    }

    if (username && username !== "") {
      userDetails.username = username;
    }

    if (email && email !== "") {
      userDetails.email = email;
    }
    if (profileImageUrl && profileImageUrl !== "") {
      userDetails.profileImageUrl = profileImageUrl;
    }

    const updatedUserInfo = await client.user.update({
      where: { id },
      data: userDetails,
    });
    res.status(200).json({
      message: "User infomation updated successfully.",
      updatedUserDetails: userDetails,
    });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  const { id } = req.user;
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await client.user.findFirst({
      where: { id },
    });
    if (!user) {
      res.status(401).json({ message: "Unauthorized. Please login" });
      return;
    }
    const isSimilar = await bcrypt.compare(currentPassword, user.password);

    if (!isSimilar) {
      res
        .status(400)
        .json({ message: "You entered a wrong current password." });
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await client.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
    res.status(200).json({ message: "Password updated successfully." });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.user;

  try {
    const deletedUser = await client.user.update({
      where: { id },
      data: { isDeleted: true },
    });
    if (deletedUser) {
      await client.blog.updateMany({
        where: { userId: id },
        data: { isDeleted: true },
      });
    }
    res.status(200).json({ message: "Account deleted successfully." });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
