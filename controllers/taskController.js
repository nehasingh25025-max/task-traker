const Task = require('../models/Task');

// 1. Naya Task Banana (Sirf Admin ke liye aage restrict karenge)
exports.createTask = async (req, res) => {
    try {
        const {
  title,
  description,
  assignedTo,
  taskType,
  dueDate,
  priority
} = req.body;
        const task = new Task({
            title,
            description,
            assignedTo,
            taskType,
            dueDate,
            priority,
            createdBy: req.user.id
        });
        await task.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: "Task banane mein error", error: err.message });
    }
};

// 2. Saare Tasks Dekhna
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: "Tasks nahi mile", error: err.message });
    }
};