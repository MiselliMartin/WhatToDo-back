import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { router as authRoutes } from "./routes/auth.routes.js";
import { router as taskRoutes } from "./routes/tasks.routes.js";
import { authRequired } from "./middlewares/validateToken.js";

dotenv.config();
export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
app.use(authRequired, taskRoutes);
//rutas

// app.use('/users', require('./users'))
// app.use('/auth', require('./auth'))
// app.use('/posts', require('./posts'))
// app.use('/comments', require('./comments'))
// app.use('/likes', require('./likes'))
