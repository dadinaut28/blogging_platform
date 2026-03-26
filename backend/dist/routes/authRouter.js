import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const authRouter = Router();
authRouter.post("/register", async (req, res) => {
    let { username, firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({
            message: "Bad Request Input: Entry missing",
        });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (username === undefined) {
            username = `@${firstname.toLowerCase()}${lastname.toLowerCase()}`;
        }
        const user = await prisma.user.create({
            data: {
                firstname,
                lastname,
                username,
                email,
                password: hashedPassword,
                role: "simple_user",
            },
        });
        res.status(201).json({
            message: "New user created successfully",
            user,
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Bad request: Email or password missing",
            });
        }
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "Incorrect email!",
            });
        }
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({
                message: "Incorrect password",
            });
        }
        process.env.JWT_SECRET_KEY &&
            jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET_KEY, (err, token) => {
                if (err)
                    return res.status(500).json({ message: "Internal Server Error" });
                res.status(200).json({
                    message: "User authenticated successfully !",
                    token,
                });
            });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
//# sourceMappingURL=authRouter.js.map