import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controller";
import validateRegisterInput from "../middlewares/validateRegisterInputs";
import checkEmailUsernameReuse from "../middlewares/checkEmailUsernameReuse";
import verifyPasswordStrength from "../middlewares/verifyPasswordStrength";
import verifyLoginInputs from "../middlewares/verifyLoginInputs";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRegisterInput,
  checkEmailUsernameReuse,
  verifyPasswordStrength,
  registerUser,
);
authRouter.post("/login", verifyLoginInputs, loginUser);

export default authRouter;
