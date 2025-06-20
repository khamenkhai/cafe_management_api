const jwt = require("jsonwebtoken");

const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check for "Bearer <token>" format
    const token = authHeader && authHeader.split(' ')[1]; // FIX: use () not []

    if (!token) {
        return res.status(401).json({ message: "Access token missing" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        res.locals = response;

        next();
    });
};

module.exports = { authenticationToken: authenticationToken };
