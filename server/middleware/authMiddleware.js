import jwt from "jsonwebtoken";
import config from "../config/config.js";


async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization header missing or malformed' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.jsonWebTokenAccessSecret);
        req.user = decoded;

        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export { auth };