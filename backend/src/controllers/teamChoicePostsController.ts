import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getTeamChoicePosts(req: Request, res: Response) {
  try {
    const posts = await prisma.teamChoicePost.findMany({
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      message: "Team's choice posts returned successfully !",
      posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function getTeamChoicePost(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const teamChoicePost = await prisma.teamChoicePost.findUnique({
      where: {
        postId: Number(id),
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!teamChoicePost) {
      return res.status(404).json({
        message: `Team's choice post with post id ${id} has not been found !`,
      });
    }

    res.status(200).json({
      message: "Team's choice returned succesfully !",
      post: teamChoicePost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function postTeamChoicePosts(req: Request, res: Response) {
  try {
    const { postId } = req.body;
    if (!postId) {
      return res.status(400).json({
        message: "Bad request: post id is missing !",
      });
    }

    const teamChoicePost = await prisma.teamChoicePost.create({
      data: {
        postId,
      },
    });

    res.status(201).json({
      message: "New team's choice post created successfully !",
      post: teamChoicePost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function deleteTeamChoicePost(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const teamChoicePost = await prisma.teamChoicePost.findUnique({
      where: {
        postId: Number(id),
      },
    });

    if (!teamChoicePost) {
      return res.status(404).json({
        message: `Team's choice post with post id ${id} has not been found !`,
      });
    }

    const deletedTeamChoicePost = await prisma.teamChoicePost.delete({
      where: {
        postId: Number(id),
      },
    });

    res.status(200).json({
      message: "The team's choice has been deleted successfully!",
      post: deletedTeamChoicePost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
