import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { authRouter } from "./routes/authRouter.js";
import { prisma } from "./lib/prisma.js";
import { postRouter } from "./routes/postsRouter.js";
import { usersRouter } from "./routes/usersRouter.js";
import { verifyToken } from "./controllers/verifyToken.js";
import { teamChoicePostsRouter } from "./routes/teamChoicePostsRouter.js";
import { categoryRouter } from "./routes/categoryRouter.js";

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
