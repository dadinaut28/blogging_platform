import { Router } from "express";
import {
  deleteTeamChoicePost,
  getTeamChoicePost,
  getTeamChoicePosts,
  postTeamChoicePosts,
} from "../controllers/teamChoicePostsController";
import { isAdmin } from "../middlewares/isAdmin";
import { checkToken } from "../middlewares/checkToken";

export const teamChoicePostsRouter = Router();

teamChoicePostsRouter.get("/", getTeamChoicePosts);
teamChoicePostsRouter.get("/:id", getTeamChoicePost);
teamChoicePostsRouter.post("/", checkToken, isAdmin, postTeamChoicePosts);
teamChoicePostsRouter.delete("/:id", checkToken, isAdmin, deleteTeamChoicePost);
