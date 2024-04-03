import User from "../models/user.model.js";
import {
  comparePasswords,
  hashPassword,
} from "../services/password.service.js";
import {
  generateToken,
  verifyToken as verifyTokenSrv,
} from "../services/jwt.service.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar si el nombre de usuario o el correo electrónico ya existen
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const errorMessage =
        existingUser.username === username
          ? "Username already exists."
          : "Email already exists.";
      res.status(400).json([errorMessage]);
      return;
    }

    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear un nuevo usuario
    const newUser = new User({ username, email, password: hashedPassword });
    const user = await newUser.save();

    if (!user) return res.status(500).json(["Error saving the user."]);

    const token = generateToken(newUser);
    res.cookie("token", token);
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      updatedAt: user.updatedAt,
      total_tasks: user.total_tasks,
    });
  } catch (error) {
    // Manejar otros errores
    console.error(error);
    res.status(500).json(["Oops... Something went wrong."]);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(["All fields must be sent."]);
  }

  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      res.clearCookie("token");
      return res.status(404).json(["User not found."]);
    }

    const passwordMatches = await comparePasswords(
      password,
      userFound.password
    );

    if (!passwordMatches) {
      res.clearCookie("token");
      return res.status(400).json(["Invalid credentials."]);
    }

    const token = generateToken(userFound);
    res.cookie("token", token);
    return res.status(200).json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      updatedAt: userFound.updatedAt,
      total_tasks: userFound.total_tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(["Oops... Something went wrong."]);
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out." });
};

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json(["User not found."]);
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      total_tasks: user.total_tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json(["Oops... Something went wrong."]);
  }
};

export const verifyToken = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json(["Unauthorized. Access denied."]);
  }
  const verifiedToken = await verifyTokenSrv(token);
  if (!verifiedToken) {
    return res.status(401).json(["Unauthorized. Access denied."]);
  }
  const userFound = await User.findById(verifiedToken.id);
  if (!userFound) return res.status(401).json(["Unauthorized. Access denied."]);

  return res.status(200).json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    updatedAt: userFound.updatedAt,
    total_tasks: userFound.total_tasks,
  });
};
