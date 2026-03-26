import jwt from "jsonwebtoken";
export function verifyToken(req, res) {
    const { token } = req.body;
    if (!token)
        return res.status(400).json({
            message: "Bad Request: token is missing",
        });
    if (process.env.JWT_SECRET_KEY) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
            if (err)
                return res.status(400).json({
                    message: "Invalid token",
                });
            res.status(200).json({
                message: "The token is valid !",
            });
        });
    }
}
//# sourceMappingURL=verifyToken.js.map