import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";
import { getAllOnePostResponses } from "../utils/spreadPostsResponses.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export async function getPosts(req: Request, res: Response) {
  try {
    const { author_id, category } = req.query;

    if (category && typeof category === "string") {
      const category_ = await prisma.category.findUnique({
        where: {
          slug: category,
        },
      });

      if (!category_)
        return res.status(404).json({
          message: `Category ${category} doesn't exist`,
        });

      const posts = await prisma.post.findMany({
        where: {
          category: {
            slug: category,
          },
        },
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
      });

      res.status(200).json({
        category: category_.name,
        message: `Posts in category ${category} returned succesfully !`,
        posts,
      });
    }

    // Return one author posts if authorId is specified in req queries
    if (author_id) {
      // Verify if it exists an author with received author id.
      const user = await prisma.user.findUnique({
        where: {
          id: Number(author_id),
        },
      });

      if (!user) {
        return res.status(404).json({
          message: `User with id ${author_id} has not been found !`,
        });
      }

      const posts = await prisma.post.findMany({
        where: {
          authorId: Number(author_id),
        },
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
      });

      return res.status(200).json({
        message: "Author posts returned successfully !",
        posts,
      });
    }

    // Return all posts, all authors comprised
    const posts = await prisma.post.findMany({
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
    });

    res.status(200).json({
      message: "Posts returned successfully !",
      posts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function postPosts(req: Request, res: Response) {
  try {
    const { title, subTitle, content, readingTime, published, categoryId } =
      req.body;

    // File inserted by multer in previous middleware
    if (!req.file) {
      return res.status(400).json({
        message: "Bad request: Cover image is required !",
      });
    }

    const coverImageUrl = await uploadToCloudinary(req.file.buffer);

    if (
      !title ||
      !subTitle ||
      !content ||
      !coverImageUrl ||
      !readingTime ||
      !published === undefined ||
      !categoryId
    ) {
      return res.status(400).json({
        message: "Bad Request input: entry missing",
      });
    }

    let authorId;
    // userInfo inserted in req by middleware checkToken
    if (typeof req.userInfo !== "string") {
      authorId = req.userInfo?.userId;
    }

    const post = await prisma.post.create({
      data: {
        title,
        subTitle,
        content,
        coverImageUrl,
        categoryId: Number(categoryId),
        readingTime: Number(readingTime),
        viewsCount: 0,
        published: published === "true",
        authorId,
      },
    });

    res.status(201).json({
      message: "New post created successfully !",
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error !",
    });
  }
}

export async function getPost(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            avatarUrl: true,
          },
        },
        responses: true,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: `Post with id ${id} has not been found !`,
      });
    }

    res.status(200).json({
      message: "Post returned successfully !!",
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error !",
    });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    let userRole, userId;

    if (typeof req.userInfo !== "string") {
      userRole = req.userInfo?.userRole;
      userId = req.userInfo?.userId;
    }

    // Allow delete only when user requesting delete is the post's author or is an admin
    if (post?.authorId !== userId && userRole !== "admin") {
      return res.status(401).json({
        message: "Access denied: user not authorized to delete this post !",
      });
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: `Post with id ${id} has not been found !`,
      });
    }

    res.status(200).json({
      message: "Post deleted successfully !!",
      post,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error !",
    });
  }
}

export async function patchPost(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    let userId, userRole;
    if (typeof req.userInfo !== "string") {
      userId = req.userInfo?.userId;
      userRole = req.userInfo?.role;
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: `Post with id ${id} has not been found !`,
      });
    }

    // Verify if user attempting to modify the post is the post owner
    if (userId !== post?.authorId) {
      return res.status(401).json({
        message: "Access denied: user not authorized to modify this post !",
      });
    }

    const { title, subTitle, content, readingTime, published } = req.body;

    if (
      !title ||
      !subTitle ||
      !content ||
      !readingTime ||
      published === undefined
    ) {
      return res.status(400).json({
        message: "Bad Request input: entry missing",
      });
    }

    if (!req.file) {
      const updatedPost = await prisma.post.update({
        data: {
          title,
          subTitle,
          content,
          readingTime: Number(readingTime),
          published: published === "true",
        },
        where: {
          id,
        },
      });

      return res.status(200).json({
        message: "Post updated successfully !",
        updatedPost,
      });
    }

    const coverImageUrl = await uploadToCloudinary(req.file.buffer);

    const updatedPost = await prisma.post.update({
      data: {
        title,
        subTitle,
        content,
        coverImageUrl,
        readingTime: Number(readingTime),
        published: published === "true",
      },
      where: {
        id,
      },
    });

    if (!updatedPost) {
      res.status(200).json({
        message: `Post with id ${id} has not been found !`,
      });
    }

    res.status(200).json({
      message: "Post updated successfully !",
      updatedPost,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error !",
    });
  }
}

export async function getPostsResponses(req: Request, res: Response) {
  try {
    const { postId } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
      include: {
        author: true,
      },
    });

    if (!post) {
      return res.status(404).json({
        message: `Post with id ${postId} has not been found !`,
      });
    }

    const responses = await getAllOnePostResponses(Number(postId));

    res.status(200).json({
      message: "Responses returned succesfully",
      responses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error !",
    });
  }
}

export async function postPostsResponses(req: Request, res: Response) {
  try {
    let userId;
    if (typeof req.userInfo !== "string") {
      userId = req.userInfo?.userId;
    }
    const { postId } = req.params;
    const { content, parentId } = req.body;

    const response = await prisma.response.create({
      data: {
        content,
        userId,
        postId: Number(postId),
        parentId: parentId ? parentId : null,
      },
    });

    res.status(201).json({
      message: "Response created successfully !",
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error !",
    });
  }
}

export async function patchPostResponse(req: Request, res: Response) {
  try {
    const { responseId } = req.params;
    const { content } = req.body;
    let userId;

    if (typeof req.userInfo !== "string") {
      userId = req.userInfo?.userId;
    }

    const response = await prisma.response.findUnique({
      where: {
        id: Number(responseId),
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!response) {
      return res.status(404).json({
        message: `Post response with ${responseId} has not been found !`,
      });
    }

    if (userId !== response?.user.id) {
      return res.status(401).json({
        message:
          "Access denied: user attempting to modify reponse is not the owner !",
      });
    }

    const updatedResponse = await prisma.response.update({
      data: {
        content,
      },
      where: {
        id: Number(responseId),
      },
    });

    res.status(200).json({
      message: "Post response has been updated successfully !",
      response: updatedResponse,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error !",
    });
  }
}

export async function delePostResponse(req: Request, res: Response) {
  try {
    const { responseId } = req.params;
    let userId;

    if (typeof req.userInfo !== "string") {
      userId = req.userInfo?.userId;
    }

    const response = await prisma.response.findUnique({
      where: {
        id: Number(responseId),
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!response) {
      return res.status(404).json({
        message: `Post response with ${responseId} has not been found !`,
      });
    }

    if (userId !== response?.user.id) {
      return res.status(401).json({
        message:
          "Access denied: user attempting to delete reponse is not the owner !",
      });
    }

    const deletedPostResponse = await prisma.response.delete({
      where: {
        id: Number(responseId),
      },
    });

    res.status(200).json({
      message: "Post response deleted successfully !",
      deletedPostResponse,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error !",
    });
  }
}
