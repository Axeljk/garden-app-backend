const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Profile } = require("../../models");

const TOKEN_EXPIRATION = "2h";

/*
 *	Summary of routes:
 *		- [base_url]/api/profiles:
 *			- GET: retrieves all users' info
 *			- POST: creates a new user ("sign-up")
 *		- [base_url]/api/profiles/:id:
 *			- GET: retreieves specific user's info
 *			- POST: creates session for user ("log-in")
 *			- PUT: updates user's settings ("edit profile")
 *			- DELETE: removes user from database.
 */

/*
 *	Profile GET-all route:
 */
router.get("/", (req, res) => {
	return Profile.find({})
		.populate("layouts")
		.then(profiles => {
			return res.json(profiles);
		}).catch(err => res.status(500).json({ message: "An error occurred.", err }));
});

/*
 *	Profile POST route (sign-up):
 */
 router.post("/", (req, res) => {
	Profile.create(req.body)
		.then((profile) => {
			console.log("PROFILE", profile);
			const token = jwt.sign(
				{
					id: profile._id,
					username: profile.username,
					email: profile.email
				},
				process.env.DB_SECRET,
				{
					expiresIn: TOKEN_EXPIRATION
				});
			console.log("TOKEN", token);
			return res.json({ token: token, profile: profile });
		}).catch(err => res.status(500).json({ message: "An error occurred.", err }));
});

/*
 *	Profile GET route (by passing single id):
 */
router.get("/:id", (req, res) => {
	Profile.find({ _id: req.params.id })
		.then(profile => {
			return res.json(profile);
		}).catch(err => res.status(500).json({ message: "An error occurred.", err }));
});

/*
 *	Profile POST route (log-in):
 */
router.post("/:id", (req, res) => {
	Profile.find({ _id: req.params.id })
		.then((err, profile) => {
			return res.json({profile});
		}).catch(err => res.status(500).json({ message: "An error occurred.", err }));
});

module.exports = router;