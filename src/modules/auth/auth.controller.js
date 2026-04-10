const { registerUser } = require("./auth.service");

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    if (!isValidEmail(String(email))) {
      return res.status(400).json({
        message: "Please provide a valid email"
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    const user = await registerUser(req.body);

    return res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      message: error.message || "Registration failed"
    });
  }
}

module.exports = {
  register
};

