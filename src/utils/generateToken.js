import jwt from "jsonwebtoken";

export const token = (payload) => {
    return jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
}

export const decoded = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}