import { prisma } from "../../lib/prisma";

interface Response {
  id: number;
  userId: number;
  postId: number;
  parentId: null | number;
  createdAt?: Date;
  updatedAt?: Date;
  replies: Response[];
}

export async function getAllOnePostResponses(postId: number) {
  async function getReplies(responses) {
    return await Promise.all(
      responses.map(async (response) => {
        const replies = await prisma.response.findMany({
          where: {
            parentId: response.id,
          },
          include: {
            user: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                avatarUrl: true,
              },
            },
            replies: true,
          },
        });

        if (replies.length > 0) {
          return {
            ...response,
            replies: await getReplies(replies),
          };
        }

        return {
          ...response,
          replies: [],
        };
      }),
    );
  }

  try {
    const responses = await prisma.response.findMany({
      where: {
        postId,
        parentId: null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            avatarUrl: true,
          },
        },
        replies: true,
      },
    });

    return await getReplies(responses);
  } catch (err) {
    console.log(err);
  }
}
