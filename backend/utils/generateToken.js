import jwt from 'jsonwebtoken'

const generateToken = (user, rememberMe = false) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: rememberMe ? "30d" : "1d" } 
    );
};

export default generateToken;