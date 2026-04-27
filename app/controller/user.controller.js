const User = require('../model/user.model');
const { ApiError } = require('../middleware/error.middleware');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find(req.query).populate('manager', 'name email');
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users },
        });
    } catch (error) {
        next(error);
    }
};

const updateRole = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true, runValidators: true });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        res.status(200).json({
            status: 'success',
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    updateRole,
    updateStatus,
};
