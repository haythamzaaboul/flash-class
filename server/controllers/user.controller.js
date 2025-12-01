import {dbPool} from '../database/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';





async function getUser(req, res) {
    try {
        const userId = req.params.id;
        const payload = req.user;
        //check the authorization
        if (parseInt(userId) !== payload.id) {
            return res.status(403).json({ message: 'Forbidden: You can only access your own user data' });
        }
        const [rows] = await dbPool.execute('SELECT id, username, email FROM users WHERE id = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


async function createUser(req, res) {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        // look if user already exists
        const [existingUser] = await dbPool.execute(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Username or email already in use' });
        }
        const [result] = await dbPool.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body;
        const [rows] = await dbPool.execute(
            'SELECT id, username, email, password FROM users WHERE email = ?',
            [email]
        );
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        };
        const user = rows[0];
        const passwordMatchj = await bcrypt.compare(password, user.password);
        if (!passwordMatchj) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const payload = {
            id : user.id,
            username : user.username,
            email : user.email
        };
        const accessToken = jwt.sign(payload, config.jsonWebTokenAccessSecret, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, config.jsonWebTokenRefreshSecret, { expiresIn: '7d' });
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

async function refreshToken(req, res) {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        try {
            const decoded = jwt.verify(token, config.jsonWebTokenRefreshSecret);
            const payload = {
                id : decoded.id,
                username : decoded.username,
                email : decoded.email
            };
            const newAccessToken = jwt.sign(payload, config.jsonWebTokenAccessSecret, { expiresIn: '15m' });
            res.status(200).json({ accessToken: newAccessToken });
        }
        catch (error) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}


export { getUser, createUser, login, refreshToken };