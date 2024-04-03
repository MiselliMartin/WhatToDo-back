import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY || "default-secret";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "4h" }
  );
};

export const verifyToken = (token) => {
  try {
    const verifiedToken = jwt.verify(token, JWT_SECRET);
    return verifiedToken;
  } catch (err) {
    if (
      err.name === "JsonWebTokenError" &&
      err.message === "invalid signature"
    ) {
      console.error("El token ha sido alterado o manipulado");
      return null;
    } else if (err.name === "TokenExpiredError") {
      // El token ha expirado
      console.error("El token ha expirado");
      return null;
    } else {
      // Otro tipo de error
      console.error("Error al verificar el token:", err.message);
      return null;
    }
  }
};
