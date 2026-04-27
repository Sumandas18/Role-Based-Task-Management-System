const Task = require('../model/task.model');
const { ApiError } = require('../middleware/error.middleware');

const createTask = async (req, res, next) => {
    try {
        const task = await Task.create({
            ...req.body,
            assignedBy: req.user._id,
        });
        res.status(201).json({
            status: 'success',
            data: { task },
        });
    } catch (error) {
        next(error);
    }
};

const getTasks = async (req, res, next) => {
    try {
        let filter = {};
        if (req.user.role === 'Employee') {
            filter = { assignedTo: req.user._id };
        } else if (req.user.role === 'Manager') {
            filter = { $or: [{ assignedBy: req.user._id }, { assignedTo: req.user._id }] };
        }

        const tasks = await Task.find(filter)
            .populate('assignedBy', 'name email role')
            .populate('assignedTo', 'name email role');

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: { tasks },
        });
    } catch (error) {
        next(error);
    }
};

const getTaskById = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedBy', 'name email role')
            .populate('assignedTo', 'name email role');

        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        if (req.user.role === 'Employee' && task.assignedTo._id.toString() !== req.user._id.toString()) {
            throw new ApiError(403, 'You do not have permission to view this task');
        }

        res.status(200).json({
            status: 'success',
            data: { task },
        });
    } catch (error) {
        next(error);
    }
};

const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        if (req.user.role === 'Employee') {
            if (task.assignedTo.toString() !== req.user._id.toString()) {
                throw new ApiError(403, 'You can only update your own tasks');
            }
            const allowedUpdates = ['status'];
            const actualUpdates = Object.keys(req.body);
            const isValidOperation = actualUpdates.every((update) => allowedUpdates.includes(update));
            if (!isValidOperation) {
                throw new ApiError(403, 'Employees can only update task status');
            }
        } else if (req.user.role === 'Manager') {
            if (task.assignedBy.toString() !== req.user._id.toString() && task.assignedTo.toString() !== req.user._id.toString()) {
                throw new ApiError(403, 'You can only update tasks you assigned or are assigned to you');
            }
        }

        Object.assign(task, req.body);
        await task.save();

        res.status(200).json({
            status: 'success',
            data: { task },
        });
    } catch (error) {
        next(error);
    }
};

const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            throw new ApiError(404, 'Task not found');
        }

        if (req.user.role === 'Employee') {
            throw new ApiError(403, 'Employees cannot delete tasks');
        } else if (req.user.role === 'Manager') {
            if (task.assignedBy.toString() !== req.user._id.toString()) {
                throw new ApiError(403, 'You can only delete tasks you assigned');
            }
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
};
