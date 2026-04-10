const bcrypt = require("bcryptjs");
const prisma = require("../../config/prisma");

async function registerUser(payload) {
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const neighborhoodId =
    typeof payload.neighborhoodId === "string" && payload.neighborhoodId.trim()
      ? payload.neighborhoodId.trim()
      : null;

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
      neighborhoodId
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

module.exports = {
  registerUser
};

