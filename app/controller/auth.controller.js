const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const { ApiError } = require('../middleware/error.middleware');

const signAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    });
};

const signRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    });
};

const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

const register = async (req, res, next) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, 'Email already in use');
        }

        const userCount = await User.countDocuments();
        if (userCount === 0) {
            req.body.role = 'SuperAdmin';
        } else {
            req.body.role = 'Employee';
        }

        const user = await User.create(req.body);
        user.password = undefined;

        res.status(201).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        
        if (!user || !(await user.comparePassword(password, user.password))) {
            throw new ApiError(401, 'Incorrect email or password');
        }

        if (user.status === 'Inactive') {
            throw new ApiError(403, 'Your account is inactive');
        }

        const accessToken = signAccessToken({ id: user._id, role: user.role });
        const refreshToken = signRefreshToken({ id: user._id });

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        user.password = undefined;
        user.refreshToken = undefined;

        res.status(200).json({
            status: 'success',
            user,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            throw new ApiError(401, 'Invalid refresh token');
        }

        const newAccessToken = signAccessToken({ id: user._id, role: user.role });
        const newRefreshToken = signRefreshToken({ id: user._id });

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: 'success',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        next(new ApiError(401, 'Invalid or expired refresh token'));
    }
};

const logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
        res.status(200).json({
            status: 'success',
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    verifyAccessToken,
};
