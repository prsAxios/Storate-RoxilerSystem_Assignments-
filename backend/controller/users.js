const ExpressError = require("../utils/ExpressErrors");
const bcrypt = require("bcryptjs");
const { SignJWT } = require("jose");
const { User, store } = require("../models");
const { Op } = require("sequelize");

// Signup route
module.exports.signup = async (req, res) => {
  const existingUser = await User.findOne({ where: { email: req.body.email } });
  if (existingUser) {
    throw new ExpressError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    role: ["user", "owner", "admin"].includes(req.body.role)
      ? req.body.role
      : "user",
  };

  // Handle profile image upload for User and Store Owner roles
  if (req.file && req.body.role !== "admin") {
    userData.picture_data = req.file.buffer;
    userData.picture_mime = req.file.mimetype;
  }

  await User.create(userData);

  res.status(201).json({ message: "User created successfully" });
};

// Login route
module.exports.login = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    throw new ExpressError(400, "Invalid email or password");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const payload = {
    id: user.id,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET;
  const secretBytes = new TextEncoder().encode(secret);
  const signer = new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt();
  const token = await signer.sign(secretBytes);

  res.status(200).json({
    token,
    role: user.role,
    message: `Welcome ${user.firstName}! to the store World`,
  });
};


module.exports.getAllUsers = async (req, res) => {
  if (req.role !== "admin") {
    throw new ExpressError(401, "not Authorized");
  }
  const users = await User.findAll({ attributes: { exclude: ["password"] } });

  res.json({
    users,
  });
};

module.exports.reportUser = async (req, res) => {
  const userId = req.userId;
  const susId = req.params.userId;
  const target = await User.findByPk(susId);
  const reporter = await User.findByPk(userId);
  await reporter.addReports(target);
  res.json({ message: "User Reported" });
};





module.exports.getMe = async (req, res) => {
  const userId = req.userId;

  const user = await User.findByPk(userId, { attributes: { exclude: ["password"] } });
  if (!user) {
    new ExpressError(404, "User not found");
  }

  res.status(201).json({
    user,
  });
};

module.exports.getUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findByPk(userId, { attributes: { exclude: ["password"] } });
  if (!user) throw new ExpressError(404, "User not Found");
  res.json({ user: user });
};

module.exports.promoteUser = async (req, res) => {
  const userId = req.params.userId;
  const masterRole = req.role;

  if (masterRole !== "admin") {
    throw new ExpressError(401, "You are not authorized");
  }

  let user = await User.findByPk(userId);

  if (!user) {
    throw new ExpressError(404, "User not found");
  }
  if (
    user.email === "prs.axios@gmail.com" ||
    user.email === "john.doe2@example.com"
  ) {
    throw new ExpressError(401, "Master Admin cannot be modified");
  }
  if (user.role === "user") {
    user.role = "admin";
    await user.save();
    return res.json({ message: "User was Promoted to Admin", user });
  } else {
    user.role = "user";
    await user.save();
    return res.json({ message: "User was Demoted to User", user });
  }
};
