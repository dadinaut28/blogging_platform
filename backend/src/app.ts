import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { authRouter } from "./routes/authRouter";
import { prisma } from "../lib/prisma";
import { postRouter } from "./routes/postsRouter";
import { usersRouter } from "./routes/usersRouter";
import { verifyToken } from "./controllers/verifyToken";
import { teamChoicePostsRouter } from "./routes/teamChoicePostsRouter";
import { categoryRouter } from "./routes/categoryRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", usersRouter);
app.use("/api/team-choice-posts", teamChoicePostsRouter);
app.use("/api/category", categoryRouter);
app.post("/api/verify-token", verifyToken);

app.use((req, res) => {
  res.status(404).json({
    message: "Not Found Error",
  });
});

app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`Server is running on port ${PORT} !!`);
});
