const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });

  res.json({
    status: "success",
    data: tasks.map(task => ({
      id: task._id,
      title: task.title,
      completed: task.completed,
      created_at: task.createdAt
    }))
  });
};

exports.createTask = async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: {
        title: ["Title is required"]
      }
    });
  }

  const task = await Task.create({
    title,
    user: req.user.id
  });

  res.status(201).json({
    status: "success",
    message: "Task created",
    data: {
      id: task._id,
      title: task.title,
      completed: task.completed
    }
  });
};

exports.updateTask = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { completed: req.body.completed },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({
      status: "error",
      message: "Task not found"
    });
  }

  res.json({
    status: "success",
    message: "Task updated"
  });
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!task) {
    return res.status(404).json({
      status: "error",
      message: "Task not found"
    });
  }

  res.json({
    status: "success",
    message: "Task deleted"
  });
};
