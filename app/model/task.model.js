const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'Pending',
        },
        assignedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dueDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
