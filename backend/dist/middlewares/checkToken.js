import jwt from "jsonwebtoken";
export function checkToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied: auth header missing !",
        });
    }
    const token = authHeader.split(" ")[1];
    if (token && process.env.JWT_SECRET_KEY) {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
            if (err)
                return res
                    .status(401)
                    .json({ message: "Access denied: invalid token!" });
            req.userInfo = payload;
            next();
        });
    }
}
//# sourceMappingURL=checkToken.js.map