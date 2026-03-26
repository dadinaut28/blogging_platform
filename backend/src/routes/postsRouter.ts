import { Router } from "express";
import {
  delePostResponse,
  deletePost,
  getPost,
  getPosts,
  getPostsResponses,
  patchPost,
  patchPostResponse,
  postPosts,
  postPostsResponses,
} from "../controllers/postsController.js";
import { checkToken } from "../middlewares/checkToken.js";
import upload from "../middlewares/upload.js";

export const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.post("/", checkToken, upload.single("coverImage"), postPosts);
postRouter.get("/:id", getPost);
postRouter.patch("/:id", checkToken, upload.single("coverImage"), patchPost);
postRouter.delete("/:id", checkToken, deletePost);

postRouter.get("/:postId/responses", getPostsResponses);
postRouter.post("/:postId/responses", checkToken, postPostsResponses);
postRouter.patch(
  "/:postId/responses/:responseId",
  checkToken,
  patchPostResponse,
);
postRouter.delete(
  "/:postId/responses/:responseId",
  checkToken,
  delePostResponse,
);
