import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.category.findMany();

    res.status(200).json({
      message: "All categories returned successfully !",
      categories,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getCategory(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      return res.status(404).json({
        message: `Category with id ${id} has not been found`,
      });
    }

    res.status(200).json({
      message: "Category returned successfully !",
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function postCategory(req: Request, res: Response) {
  try {
    const { categoryName, slug } = req.body;
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        slug,
      },
    });

    res.status(200).json({
      message: "New category created successfully !",
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function patchCategory(req: Request, res: Response) {
  try {
    const { categoryName } = req.body;
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      return res.status(404).json({
        message: `Category with id ${id} has not been found`,
      });
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name: categoryName,
      },
    });

    res.status(200).json({
      message: "Category updated successfully !",
      category: updatedCategory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    console.log("Id: ", id);

    const category = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!category) {
      return res.status(404).json({
        message: `Category with id ${id} has not been found`,
      });
    }

    const deletedCategory = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      message: "Category deleted successfully!",
      deletedCategory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}
