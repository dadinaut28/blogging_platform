import { Router } from "express";
import {
  deleteCategory,
  getCategories,
  getCategory,
  patchCategory,
  postCategory,
} from "../controllers/categoryController";
import { checkToken } from "../middlewares/checkToken";
import { isAdmin } from "../middlewares/isAdmin";

export const categoryRouter = Router();

categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategory);
categoryRouter.post("/", postCategory);
categoryRouter.patch("/:id", checkToken, isAdmin, patchCategory);
categoryRouter.delete("/:id", checkToken, isAdmin, deleteCategory);
