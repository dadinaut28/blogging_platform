import { prisma } from "../lib/prisma.js";
export async function getAllOnePostResponses(postId) {
    async function getReplies(responses) {
        return await Promise.all(responses.map(async (response) => {
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
        }));
    }
    try {
        // Get parent responses
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
    }
    catch (err) {
        console.log(err);
    }
}
//# sourceMappingURL=spreadPostsResponses.js.map
