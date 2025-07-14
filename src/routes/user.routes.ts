import { Router } from "express";
import {
  updateUserInfo,
  updateUserPassword,
  getUserBlogs,
  deleteUser,
} from "../controllers/user.controller";
import verifyUser from "../middlewares/verifyUser";

const userRouter = Router();

userRouter.patch("/", verifyUser, updateUserInfo);
userRouter.patch("/password", verifyUser, updateUserPassword);
userRouter.get("/blogs", verifyUser, getUserBlogs);
userRouter.delete("/delete", verifyUser, deleteUser);
export default userRouter;
