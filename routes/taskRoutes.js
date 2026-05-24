const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const Task = require("../models/Task");



// ========================================
// GET USER TASKS
// ========================================

router.get(
  "/all",
  authMiddleware,
  async (req, res) => {

    try {

      let tasks;

      // ADMIN CAN SEE EVERYTHING
      if (req.user.role === "admin") {

        tasks = await Task.find()
          .populate("assignedTo", "name email role")
          .populate("createdBy", "name")
          .sort({ createdAt: -1 });

      }

      // TASKER CAN SEE ONLY OWN TASKS
      else {

        tasks = await Task.find({
          assignedTo: req.user.id,
        })
          .populate("assignedTo", "name")
          .sort({ createdAt: -1 });
      }

      return res.json(tasks);

    } catch (err) {

      return res.status(500).json({
        message: "Failed to fetch tasks",
      });
    }
  }
);



// ========================================
// ADMIN GLOBAL TASK ACCESS
// ========================================

router.get(
  "/admin/all-tasks",
  authMiddleware,
  async (req, res) => {

    try {

      if (req.user.role !== "admin") {

        return res.status(403).json({
          message: "Access denied",
        });
      }

      const tasks = await Task.find()
        .populate("assignedTo", "name email")
        .populate("createdBy", "name")
        .sort({ createdAt: -1 });

      return res.json(tasks);

    } catch (err) {

      return res.status(500).json({
        message: "Failed to load all tasks",
      });
    }
  }
);



// ========================================
// CREATE TASK
// ========================================

router.post(
  "/create",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        title,
        description,
        taskType,
        dueDate,
        priority,
        assignedTo,
      } = req.body;

      const newTask = new Task({

        title,
        description,
        taskType,
        dueDate,
        priority,
        assignedTo,

        createdBy: req.user.id,

        status: "Pending",
      });

      const savedTask =
        await newTask.save();

      return res.json(savedTask);

    } catch (err) {

      return res.status(500).json({
        message: "Task creation failed",
      });
    }
  }
);

module.exports = router;