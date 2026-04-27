const User = require('../model/user.model');
const { verifyAccessToken } = require('../controller/auth.controller');
const { ApiError } = require('../middleware/error.middleware');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new ApiError(401, 'You are not logged in. Please log in to get access.');
        }

        const decoded = verifyAccessToken(token);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            throw new ApiError(401, 'The user belonging to this token no longer exists.');
        }

        if (currentUser.status === 'Inactive') {
            throw new ApiError(403, 'Your account is inactive. Please contact admin.');
        }

        req.user = currentUser;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { protect };
