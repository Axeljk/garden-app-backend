const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;
const { User, Garden, Specimen } = require("../models");

module.exports = {
	async getGarden(req, res) {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token)
				return res.status(403).json({ message: "Unauthorized access." });
			const tokenData = jwt.verify(token, process.env.DB_SECRET);

			// Block client if they don't provide a valid token.
			if (!tokenData?.id)
				return res.status(403).json({ message: "Unauthorized access." });

			// Verify garden is the client's by matching the IDs.
			const user = await User.findOne({ _id: tokenData.id }).populate("gardens");
			const gardenId = user.gardens.filter(e => e._id.equals(req.params.id));

			// Return error if garden doesn't match user.
			if (!gardenId)
				return res.status(403).json({ message: "Unauthorized access." });

			// Return garden (if found), otherwise return error.
			const garden = await Garden.findOne({ _id: gardenId });
			if (!garden)
				return res.status(404).json({ message: "Garden not found." });
			return res.json(garden);
		} catch {
			return res.status(500).json({ message: "An error occurred." });
		}
	},
	async createGarden(req, res) {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token)
				return res.status(403).json({ message: "Unauthorized access." });
			const tokenData = jwt.verify(token, process.env.DB_SECRET);

			// Block client if they don't provide a valid token.
			if (!tokenData?.id)
				return res.status(403).json({ message: "Unauthorized access." });

			console.log("MADE IT TO CREATION")
			// Create Garden and add it to the user's gardens foreign key.
			const garden = await Garden.create(req.body);
			if (!garden)
				return res.status(401).json({ message: "Invalid information."});
			console.log("GOT THIS FAR");
			const user = await User.findOneAndUpdate(
				{ _id: req.body.userId },
				{ $push: { gardens: garden._id }},
				{ new: true });

			if (!user)
				return res.status(404).json({ message: "User not found." });
			return res.json(garden);
		} catch {
			return res.status(500).json({ message: "An error occurred." });
		}
	},
	async editGarden(req, res) {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token)
				return res.status(403).json({ message: "Unauthorized access." });
			const tokenData = jwt.verify(token, process.env.DB_SECRET);

			// Block client if they don't provide a valid token.
			if (!tokenData?.id)
				return res.status(403).json({ message: "Unauthorized access." });

			// Update Garden.
			const garden = await Garden.findOneAndUpdate(
				{ _id: req.params.id },
				{ $set: req.body },
				{ runValidators: true, new: true });
			if (!garden)
				return res.status(404).json({ message: "Garden not found." });
			return res.json(garden);
		} catch {
			return res.status(500).json({ message: "An error occurred." });
		}
	},
	async deleteGarden(req, res) {
		try {
			const token = req.headers.authorization?.split(" ")[1];
			if (!token)
				return res.status(403).json({ message: "Unauthorized access." });
			const tokenData = jwt.verify(token, process.env.DB_SECRET);

			// Block client if they don't provide a valid token.
			if (!tokenData?.id)
			return res.status(403).json({ message: "Unauthorized access." });

			const garden = await Garden.findOneAndDelete({ _id: req.params.id });
			if (!garden)
				return res.status(404).json({ message: "Garden not found."});
			const user = await User.findOneAndUpdate(
				{ _id: req.body.userId },
				{ $pull: { gardens: garden._id }},
				{ new: true });
			if (!user)
				return res.status(404).json({ message: "User not found." });
			return res.json(garden);
		} catch {
			return res.status(500).json({ message: "An error occurred." });
		}
	}
};