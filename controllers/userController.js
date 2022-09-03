const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const TOKEN_EXPIRATION = "2h";

module.exports = {


  // Get all user users
  getAllUsers(req, res) {
    User.find({})
      .populate("layouts")
      .then((users) => {
        return res.json(users);
      })
      .catch((err) =>
        res.status(500).json({ message: "An error occurred.", err })
      );
  },

 // Add a user (sign up)
  createUser(req, res) {
    User.create(req.body)
      .then((user) => {
        const token = jwt.sign(
          {
            id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            location:{
            city: user.city,
            state: user.state
            }
          },
          process.env.DB_SECRET,
          {
            expiresIn: TOKEN_EXPIRATION,
          }
        );
        return res.json({ token: token, user: user });
      })
      .catch((err) =>
        res.status(500).json({ message: "An error occurred.", err })
      );
  },

	checkToken(req, res) {
		const token = req.headers.authorization?.split(" ")[1];

		try {
			res.json(jwt.verify(token, process.env.DB_SECRET));
		} catch {
			res.status(403).json({ message: "Access forbidden." });
		}
	},

  // Get a specific user
  getSingleUser(req, res) {
    User.find({ _id: req.params.userId })
      .then((user) => {
        return res.json(user);
      })
      .catch((err) =>
        res.status(500).json({ message: "An error occurred.", err })
      );
  },

  // Existing user login
  loginUser(req, res) {
    User.findOne({ email: req.body.email })
      .then((user) => {
        // Check id was found (exists) and the password matches.
        if (!user)
          return res.status(404).json({ message: "User not found." });
        else if (!bcrypt.compareSync(req.body.password, user.password))
          return res.status(401).json({ message: "Invalid credentials." });

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username,
				email: user.email,
			},
			process.env.DB_SECRET,
			{
				expiresIn: TOKEN_EXPIRATION,
			}
		);

        return res.json({ token: token, user: user });
      })
      .catch((err) =>
        res.status(500).json({ message: "An error occurred.", err })
      );
  },

  // Edit user
  updateUser(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const tokenData = jwt.verify(token, process.env.DB_SECRET);

    if (req.params.id === tokenData.id) {
      User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body }
      )
        .then((user) => {
          if (user) return res.json(user);
          else return res.status(404).json({ message: "User not found." });
        })
        .catch((err) =>
          res.status(500).json({ message: "An error occurred.", err })
        );
    } else return res.status(401).json({ message: "Invalid credientials." });
  },

  // Delete user
  deleteUser(req, res) {
    // Verify this is the correct user/client has permission.
    const token = req.headers.authorization.split(" ")[1];
    const tokenData = jwt.verify(token, process.env.DB_SECRET);

    if (req.params.id === tokenData.id) {
      User.findOneAndRemove({ _id: req.params.userId })
        .then((user) => {
          if (user) return res.json(user);
          else return res.status(404).json({ message: "User not found." });
        })
        .catch((err) =>
          res.status(500).json({ message: "An error occurred.", err })
        );
    } else return res.status(401).json({ message: "An error occurred.", err });
  },
};
