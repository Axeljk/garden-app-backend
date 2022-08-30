const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;
const { Profile, Plant, Layout } = require("../models");

module.exports = {
	async getLayout(req, res) {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token)
				return res.status(403).json({ message: "Unauthorized access." });
			const tokenData = jwt.verify(token, process.env.DB_SECRET);

			// Block client if they don't provide a valid token.
			if (!tokenData?.id)
				return res.status(403).json({ message: "Unauthorized access." });

			// Verify layout is the client's by matching the IDs.
			const profile = await Profile.findOne({ _id: tokenData.id }).populate("layouts");
			const layoutId = profile.layouts.filter(e => e._id.equals(req.params.id));

			// Return error if layout doesn't match profile.
			if (!layoutId)
				return res.status(403).json({ message: "Unauthorized access." });

			// Return layout (if found), otherwise return error.
			const layout = await Layout.findOne({ _id: layoutId });
			if (!layout)
				return res.status(404).json({ message: "Layout not found." });
			return res.json(layout);
		} catch {
			return res.status(500).json({ message: "An error occurred." });
		}
	},
	async createLayout(req, res) {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token)
				return res.status(403).json({ message: "Unauthorized access." });
			const tokenData = jwt.verify(token, process.env.DB_SECRET);

			// Block client if they don't provide a valid token.
			if (!tokenData?.id)
				return res.status(403).json({ message: "Unauthorized access." });

			// Create Layout and add it to the profile's layouts foreign key.
			const layout = await Layout.create(req.body);
			if (!layout)
				return res.status(401).json({ message: "Invalid information."});
			const profile = await Profile.findOneAndUpdate(
				{ _id: req.body.profileId },
				{ $push: { layouts: layout._id }},
				{ new: true });

			if (!profile)
				return res.status(404).json({ message: "Layout not found." });
			return res.json(layout);
		} catch {
			return res.status(500).json({ message: "An error occurred." });
		}
	},
	async editLayout(req, res) {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token)
				return res.status(403).json({ message: "Unauthorized access." });
			const tokenData = jwt.verify(token, process.env.DB_SECRET);

			// Block client if they don't provide a valid token.
			if (!tokenData?.id)
				return res.status(403).json({ message: "Unauthorized access." });

			// Update Layout.
			const layout = await Layout.findOneAndUpdate(
				{ _id: req.params.id },
				{ $set: req.body },
				{ runValidators: true, new: true });
			if (!layout)
				return res.status(404).json({ message: "Layout not found." });
			return res.json(layout);
		} catch {
			return res.status(500).json({ message: "An error occurred." });
		}
	},
	async deleteLayout(req, res) {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token)
				return res.status(403).json({ message: "Unauthorized access." });
			const tokenData = jwt.verify(token, process.env.DB_SECRET);

			// Block client if they don't provide a valid token.
			if (!tokenData?.id)
			return res.status(403).json({ message: "Unauthorized access." });

			const layout = await Layout.findOneAndDelete({ _id: req.params.id });
			if (!layout)
				return res.status(404).json({ message: "Layout not found."});
			const profile = await Profile.findOneAndUpdate(
				{ _id: req.body.profileId },
				{ $pull: { layouts: layout._id }},
				{ new: true });
			return res.json(layout);
		} catch {
			return res.status(500).json({ message: "An error occurred." });
		}
	}
};