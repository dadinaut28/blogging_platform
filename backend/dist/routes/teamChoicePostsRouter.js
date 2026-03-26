import { Router } from "express";
import { deleteTeamChoicePost, getTeamChoicePost, getTeamChoicePosts, postTeamChoicePosts, } from "../controllers/teamChoicePostsController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { checkToken } from "../middlewares/checkToken.js";
export const teamChoicePostsRouter = Router();
teamChoicePostsRouter.get("/", getTeamChoicePosts);
teamChoicePostsRouter.get("/:id", getTeamChoicePost);
teamChoicePostsRouter.post("/", checkToken, isAdmin, postTeamChoicePosts);
teamChoicePostsRouter.delete("/:id", checkToken, isAdmin, deleteTeamChoicePost);
//# sourceMappingURL=teamChoicePostsRouter.js.map