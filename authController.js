const { validationResult } = require("express-validator");
const Role = require("./models/role");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret } = require("./config");

const generateToken = (id, role) => {
  const payload = {
    id,
    role,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authConstroller {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Registration error!", errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "User with the same name already exists!!" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "user" });
      const user = new User({ username, hashPassword, role: [userRole] });
      await user.save();
      return res.json({ message: "user successfully registered" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "registartion error" });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: `User ${username} not found!` });
      }
      const validPassword = bcrypt.compareSync(password, user.pasword);
      if (!validPassword) {
        return res.status(400).json({ message: `Password not correct!` });
      }
      const token = generateToken(user._id, user.role);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "login error" });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find();
      return res.json(users);
      // save in mongoDB
      //   const userRole = new Role();
      //   const adminRole = new Role({ value: "admin" });
      //   await userRole.save();
      //   await adminRole.save();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = new authConstroller();
