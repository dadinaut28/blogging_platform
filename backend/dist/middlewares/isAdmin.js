export async function isAdmin(req, res, next) {
    try {
        let userRole;
        if (typeof req.userInfo !== "string") {
            userRole = req.userInfo?.userRole;
        }
        if (userRole !== "admin") {
            return res.status(403).json({
                message: "Access denied: only admin allowed !",
            });
        }
        next();
    }
    catch (err) {
        res.status(500).json({
            message: "Internal Server error",
        });
    }
}
//# sourceMappingURL=isAdmin.js.map