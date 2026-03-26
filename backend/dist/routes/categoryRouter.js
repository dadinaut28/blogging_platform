import { Router } from "express";
import { deleteCategory, getCategories, getCategory, patchCategory, postCategory, } from "../controllers/categoryController.js";
import { checkToken } from "../middlewares/checkToken.js";
import { isAdmin } from "../middlewares/isAdmin.js";
export const categoryRouter = Router();
categoryRouter.get("/", getCategories);
categoryRouter.get("/:id", getCategory);
categoryRouter.post("/", postCategory);
categoryRouter.patch("/:id", checkToken, isAdmin, patchCategory);
categoryRouter.delete("/:id", checkToken, isAdmin, deleteCategory);
//# sourceMappingURL=categoryRouter.js.map