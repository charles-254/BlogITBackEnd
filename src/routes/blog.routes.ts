import { Router } from "express";
import {
  createBlog,
  getAllBlogs,
  getSpecificBlog,
  deleteBlog,
  updateBlog,
} from "../controllers/blogs.controller";
import verifyUser from "../middlewares/verifyUser";
import verifyBlogFormDetails from "../middlewares/verifyBlogFormDetails";

const blogRouter = Router();

blogRouter.post("/", verifyUser, verifyBlogFormDetails, createBlog);
blogRouter.get("/", getAllBlogs);
blogRouter.get("/:blogId", verifyUser, getSpecificBlog);
blogRouter.patch("/:blogId", verifyUser, updateBlog);
blogRouter.delete("/:blogId", verifyUser, deleteBlog);
export default blogRouter;
