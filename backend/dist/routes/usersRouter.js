import { Router } from "express";
import { getConnectedUser, getUser } from "../controllers/usersController.js";
import { checkToken } from "../middlewares/checkToken.js";
export const usersRouter = Router();
usersRouter.get("/me", checkToken, getConnectedUser);
usersRouter.get("/:id", getUser);
//# sourceMappingURL=usersRouter.js.map