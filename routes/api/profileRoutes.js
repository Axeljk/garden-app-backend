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
		.then(profile => {
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
	Profile.findOne({ _id: req.params.id })
		.then(profile => {
			// Check id was found (exists) and the password matches.
//			console.log("PROFILE", profile);
			console.log("BODY:", req.body.password, "PROFILE:", profile.password)
			if (!profile)
				return res.status(401).json({ message: "Invalid credentials." });
			else if (!bcrypt.compareSync(req.body.password, profile.password))
				return res.status(401).json({ message: "Invalid credentials." });

			return res.json({  profile: profile });
		}).catch(err => res.status(500).json({ message: "An error occurred.", err }));
});

/*
 *	Profile PUT route (edit profile/settings):
 *		- Get data from token (using secret pw) and compare to url to verify correct user.
 */
router.put("/:id", (req, res) => {
	const token = req.headers.authorization.split(" ")[1];
	const tokenData = jwt.verify(token, process.env.DB_SECRET);

	if (req.params.id === tokenData.id) {
		Profile.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
			.then(profile => {
				if (profile)
					return res.json(profile);
				else
					return res.status(404).json({ message: "User not found." });
			}).catch(err => res.status(500).json({ message: "An error occurred.", err }));
	} else
		return res.status(401).json({ message: "Invalid credientials." });
});

/*
 *	Profile DELETE route:
 *		- Get data from token (using secret pw) and compare to url to verify correct user.
 */
router.delete("/:id", (req, res) => {
	// Verify this is the correct profile/client has permission.
	const token = req.headers.authorization.split(" ")[1];
	const tokenData = jwt.verify(token, process.env.DB_SECRET);

	if (req.params.id === tokenData.id) {
		Profile.findOneAndRemove({ _id: req.params.id })
			.then(profile => {
				if (profile)
					return res.json(profile);
				else
					return res.status(404).json({ message: "User not found." });
			}).catch(err => res.status(500).json({ message: "An error occurred.", err }));
	} else
		return res.status(401).json({ message: "An error occurred.", err });
})

module.exports = router;