const { registerUser } = require("./auth.service");

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new Error("Email and password are required");
      err.statusCode = 400;
      return next(err);
    }

    if (!isValidEmail(String(email))) {
      const err = new Error("Please provide a valid email");
      err.statusCode = 400;
      return next(err);
    }

    if (String(password).length < 6) {
      const err = new Error("Password must be at least 6 characters long");
      err.statusCode = 400;
      return next(err);
    }

    const user = await registerUser(req.body);

    return res.status(201).json({
      message: "User registered successfully",
      user
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register
};
