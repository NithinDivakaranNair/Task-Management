import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user });
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title, description } = req.body;
  if (!title)
    return res.status(400).json({ message: "Title required" });

  const task = await Task.create({
    user: req.user,
    title,
    description
  });

  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.user.toString() !== req.user)
    return res.status(401).json({ message: "Unauthorized" });

  Object.assign(task, req.body);
  await task.save();
  res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (task.user.toString() !== req.user)
    return res.status(401).json({ message: "Unauthorized" });

  await task.deleteOne();
  res.json({ message: "Task removed" });
};
