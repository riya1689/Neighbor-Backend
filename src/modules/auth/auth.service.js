const bcrypt = require("bcryptjs");
const prisma = require("../../config/prisma");

async function registerUser(payload) {
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const fallbackName = email.split("@")[0] || "User";
  const name =
    typeof payload.name === "string" && payload.name.trim()
      ? payload.name.trim()
      : fallbackName;

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER",
      neighborhoodId: null
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      neighborhoodId: true,
      createdAt: true
    }
  });

  return createdUser;
}

async function loginUser(payload) {
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      neighborhoodId: true,
      createdAt: true,
      password: true
    }
  });

  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const { password: _password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

module.exports = {
  registerUser,
  loginUser
};
