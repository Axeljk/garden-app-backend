const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Profile } = require("../models");

const TOKEN_EXPIRATION = "2h";

module.exports = {


  // Get all user profiles
  getAllProfiles(req, res) {
    Profile.find({})
      .populate("layouts")
      .then((profiles) => {
        return res.json(profiles);
      })
      .catch((err) =>
        res.status(500).json({ message: "An error occurred.", err })
      );
  },

 // Add a user profile (sign up)
  createProfile(req, res) {
    Profile.create(req.body)
      .then((profile) => {
        const token = jwt.sign(
          {
            id: profile._id,
            username: profile.username,
            email: profile.email,
          },
          process.env.DB_SECRET,
          {
            expiresIn: TOKEN_EXPIRATION,
          }
        );
        return res.json({ token: token, profile: profile });
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

  // Get a specific user profile
  getSingleProfile(req, res) {
    Profile.find({ _id: req.params.profileId })
      .then((profile) => {
        return res.json(profile);
      })
      .catch((err) =>
        res.status(500).json({ message: "An error occurred.", err })
      );
  },

  // Existing user login
  loginProfile(req, res) {
    Profile.findOne({ email: req.body.email })
      .then((profile) => {
        // Check id was found (exists) and the password matches.
        if (!profile)
          return res.status(404).json({ message: "Profile not found." });
        else if (!bcrypt.compareSync(req.body.password, profile.password))
          return res.status(401).json({ message: "Invalid credentials." });

		const token = jwt.sign(
			{
				id: profile._id,
				username: profile.username,
				email: profile.email,
			},
			process.env.DB_SECRET,
			{
				expiresIn: TOKEN_EXPIRATION,
			}
		);

        return res.json({ token: token, profile: profile });
      })
      .catch((err) =>
        res.status(500).json({ message: "An error occurred.", err })
      );
  },

  // Edit profile
  updateProfile(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const tokenData = jwt.verify(token, process.env.DB_SECRET);

    if (req.params.id === tokenData.id) {
      Profile.findOneAndUpdate(
        { _id: req.params.profileId },
        { $set: req.body }
      )
        .then((profile) => {
          if (profile) return res.json(profile);
          else return res.status(404).json({ message: "User not found." });
        })
        .catch((err) =>
          res.status(500).json({ message: "An error occurred.", err })
        );
    } else return res.status(401).json({ message: "Invalid credientials." });
  },

  // Delete profile
  deleteProfile(req, res) {
    // Verify this is the correct profile/client has permission.
    const token = req.headers.authorization.split(" ")[1];
    const tokenData = jwt.verify(token, process.env.DB_SECRET);

    if (req.params.id === tokenData.id) {
      Profile.findOneAndRemove({ _id: req.params.profileId })
        .then((profile) => {
          if (profile) return res.json(profile);
          else return res.status(404).json({ message: "User not found." });
        })
        .catch((err) =>
          res.status(500).json({ message: "An error occurred.", err })
        );
    } else return res.status(401).json({ message: "An error occurred.", err });
  },
};
