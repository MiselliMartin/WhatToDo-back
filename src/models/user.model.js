import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 4,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      required: true,
      validate: {
        validator: (v) => {
          // Expresión regular para verificar si el valor es un correo electrónico válido
          // Esta expresión regular puede variar dependiendo de tus necesidades de validación
          return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
        },
        message: (props) =>
          `${props.value} no es un correo electrónico válido.`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    total_tasks: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    timeseries: {
      timeZone: "America/Argentina/Buenos_Aires",
    },
  }
);

export default mongoose.model("User", userSchema);
