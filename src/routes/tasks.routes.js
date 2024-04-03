import express from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
  finishTask,
} from "../controllers/tasks.controller.js";
export const router = express();

router.get("/tasks", getAllTasks);
router.post("/tasks", createTask);
router.get("/tasks/:id", getTaskById);
router.put("/tasks/:id", updateTask);
router.put("/tasks/finish/:id", finishTask);
router.delete("/tasks/:id", deleteTask);
