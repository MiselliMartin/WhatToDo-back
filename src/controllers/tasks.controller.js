import Task from "../models/task.model.js";
import User from "../models/user.model.js";

export const getAllTasks = async (req, res) => {
  const { category, priority, done } = req.query;
  if (category && priority && done) {
    let newDone;
    if (done === "finalizadas") {
      newDone = true;
    } else {
      newDone = false;
    }
    try {
      const tasks = await Task.find({
        userId: req.userId,
        done: newDone,
        category: category.toLowerCase(),
        priority: priority.toLowerCase(),
      });
      if (!tasks) return res.status(404).json(["No tasks found."]);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json([error.message]);
    }
  }
  if (category && priority) {
    try {
      const tasks = await Task.find({
        userId: req.userId,
        category: category.toLowerCase(),
        priority: priority.toLowerCase(),
      });
      if (!tasks) return res.status(404).json(["No tasks found."]);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json([error.message]);
    }
  }
  if (category && done) {
    let newDone;
    if (done === "finalizadas") {
      newDone = true;
    } else {
      newDone = false;
    }
    try {
      const tasks = await Task.find({
        userId: req.userId,
        done: newDone,
        category: category.toLowerCase(),
      });
      if (!tasks) return res.status(404).json(["No tasks found."]);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json([error.message]);
    }
  }
  if (priority && done) {
    let newDone;
    if (done === "finalizadas") {
      newDone = true;
    } else {
      newDone = false;
    }
    try {
      const tasks = await Task.find({
        userId: req.userId,
        done: newDone,
        priority: priority.toLowerCase(),
      });
      if (!tasks) return res.status(404).json(["No tasks found."]);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json([error.message]);
    }
  }
  if (done) {
    let newDone;
    if (done === "finalizadas") {
      newDone = true;
    } else {
      newDone = false;
    }
    try {
      const tasks = await Task.find({
        userId: req.userId,
        done: newDone,
      });
      if (!tasks) return res.status(404).json(["No tasks found."]);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json([error.message]);
    }
  }
  if (category) {
    try {
      const tasks = await Task.find({
        userId: req.userId,
        category: category.toLowerCase(),
      });
      if (!tasks) return res.status(404).json(["No tasks found."]);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json([error.message]);
    }
  }
  if (priority) {
    try {
      const tasks = await Task.find({
        userId: req.userId,
        priority: priority.toLowerCase(),
      });
      if (!tasks) return res.status(404).json(["No tasks found."]);
      return res.status(200).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json([error.message]);
    }
  }
  try {
    const tasks = await Task.find({ userId: req.userId });
    if (!tasks) return res.status(404).json(["No tasks found."]);
    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json([error.message]);
  }
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.find({ userId: req.userId, _id: id });
    if (!task) return res.status(404).json(["Task not found."]);
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json([error.message]);
  }
};

export const createTask = async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);
  user.total_tasks += 1;
  try {
    await user.save();
  } catch (error) {
    console.error(error);
  }

  const { title, description, dueDate, priority, category } = req.body;
  if (!title || !description) {
    res.status(400).json(["Title and description are required."]);
    return;
  }

  let newTask = new Task();
  newTask.title = title;
  newTask.description = description;
  newTask.userId = userId;
  if (dueDate) {
    newTask.dueDate = dueDate;
  }
  if (priority) {
    newTask.priority = priority.toLowerCase();
  }
  if (category) {
    newTask.category = category.toLowerCase();
  }

  try {
    const task = await newTask.save();
    res.status(201).json({ newTask: task });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res.status(400).json([error.message]);
    } else {
      res.status(500).json(["Oops... Something went wrong."]);
    }
  }
};
export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({ userId: req.userId, _id: id });
    if (!task) return res.status(404).json(["Task not found."]);
    res.status(200).json({ message: "Task deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json([error.message]);
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndUpdate(
      { userId: req.userId, _id: id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json(["Task not found."]);
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json([error.message]);
  }
};

export const finishTask = async (req, res) => {
  const { id } = req.params;
  try {
    const tasktoUpdate = await Task.findOne({ userId: req.userId, _id: id });
    if (!tasktoUpdate) return res.status(404).json(["Task not found."]);
    const task = await Task.findOneAndUpdate(
      { userId: req.userId, _id: id },
      { $set: { done: !tasktoUpdate.done } },
      { new: true }
    );
    if (!task) return res.status(404).json(["Task not found."]);
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json([error.message]);
  }
};
