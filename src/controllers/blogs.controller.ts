import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const allBlogs = await client.blog.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        user: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },
    });
    res.status(200).json({ allBlogs });
  } catch (_e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const getSpecificBlog = async (req: Request, res: Response) => {
  const { blogId } = req.params;
  try {
    const blog = await client.blog.findFirst({
      where: {
        AND: [{ id: blogId }, { isDeleted: false }],
      },
      include: {
        user: {
          select: {
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImageUrl: true,
          },
        },
      },
    });
    if (!blog) {
      res.status(404).json({ message: "Not found." });
      return;
    }
    res.status(200).json({ message: "Fetched blog successfully", blog });
  } catch (_e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const { blogId } = req.params;
  try {
    const exists = await client.blog.findFirst({
      where: {
        AND: [{ id: blogId }, { isDeleted: false }],
      },
    });
    if (!exists) {
      res.status(404).json({ message: "Not found." });
      return;
    }
    const deletedBlog = await client.blog.update({
      where: { id: blogId },
      data: {
        isDeleted: true,
      },
    });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const { blogId } = req.params;
  try {
    const exists = await client.blog.findFirst({
      where: {
        AND: [{ id: blogId }, { isDeleted: false }],
      },
    });
    if (!exists) {
      res.status(404).json({ message: "Not found." });
      return;
    }
    const { title, synopsis, content, imageUrl } = req.body;
    const updateData: any = {};

    if (title && title !== "") {
      updateData.title = title;
    }

    if (synopsis && synopsis !== "") {
      updateData.synopsis = synopsis;
    }

    if (content && content !== "") {
      updateData.content = content;
    }

    if (imageUrl && imageUrl !== "") {
      updateData.imageUrl = imageUrl;
    }
    const updatedBlog = await client.blog.update({
      where: { id: blogId },
      data: updateData,
    });
    res.status(200).json({ message: "Blog updated successfully" });
  } catch (e) {
    console.error("UPDATE BLOG ERROR:", e);
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  const { title, synopsis, imageUrl, content } = req.body;
  const { id } = req.user;
  try {
    const newBlog = await client.blog.create({
      data: { title, synopsis, imageUrl, content, userId: id },
    });
    res
      .status(201)
      .json({ message: "Blog created succeffully.", blog: newBlog });
  } catch (e) {
    res.status(500).json({ message: "Something went wrong." });
  }
};
