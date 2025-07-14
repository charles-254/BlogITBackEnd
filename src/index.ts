import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import blogRouter from "./routes/blog.routes";
import userRouter from "./routes/user.routes";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: ["https://blog-it-beryl.vercel.app"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/user", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sever up and listening on port ${port}`);
});
