import { Router } from "express";
import { getConnectedUser, getUser } from "../controllers/usersController";
import { checkToken } from "../middlewares/checkToken";

export const usersRouter = Router();

usersRouter.get("/me", checkToken, getConnectedUser);
usersRouter.get("/:id", getUser);
