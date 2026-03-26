import { prisma } from "../lib/prisma.js";
export async function getUser(req, res) {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (!user) {
            res.status(404).json({
                message: `User with id ${id} has not been found !`,
            });
        }
        res.status(200).json({
            message: "User returned successfully !",
            user,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}
export async function getConnectedUser(req, res) {
    try {
        let userId;
        if (typeof req.userInfo !== "string") {
            userId = req.userInfo?.userId;
        }
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                firstname: true,
                lastname: true,
                username: true,
                description: true,
                role: true,
                bio: true,
                avatarUrl: true,
                website: true,
            },
        });
        res.status(200).json({
            message: "Connected user returned successfully !",
            user,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error",
            test: "dfzydfyz",
        });
    }
}
//# sourceMappingURL=usersController.js.map
