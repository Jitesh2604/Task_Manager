const express = require("express");
const Task = require("../models/task.model");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    console.log(req.user);
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});

router.post("/", async (req, res) => {
  console.log('in task controller', req.body)
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const newTask = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      userId: req.user.id,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ Error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ Error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(404).json({ Error: err.message });
  }
});

module.exports = router;
