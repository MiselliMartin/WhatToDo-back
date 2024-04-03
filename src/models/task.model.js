import mongoose from "mongoose";
import User from "./user.model.js";
import moment from "moment";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      maxlength: 40,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10, // Agregamos una validación de longitud mínima
    },
    done: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
      default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"], // Agregamos un campo de prioridad con valores permitidos
      default: "medium",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencia al esquema de usuarios
    },
    category: {
      type: String,
      enum: ["work", "study", "fun", "housework", "other", "social"],
      default: "other",
    },
  },
  {
    timestamps: true,
    timeseries: {
      timeZone: "America/Argentina/Buenos_Aires",
    },
  }
);

// Índice compuesto para mejorar el rendimiento de las consultas
taskSchema.index({ priority: 1 });

export default mongoose.model("Task", taskSchema);
