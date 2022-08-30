const { ObjectId } = require("mongoose").Types;
const { Profile, Plant, Layout, Species } = require("../models");

module.exports = {
  
  // Get a plant
  getSinglePlant(req, res) {
    Plant.findOne({ _id: req.params.plantId })
      .select("-__v")
      .then((plant) => {
        if (!plant) {
          return res.status(404).json({ message: "There is no plant with this id." });
        }
        res.json(plant);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Create a plant attached to a profile
  createPlant(req, res) {
    Plant.create(req.body)
      .then((plant) => {
        return Profile.findOneAndUpdate(
          { _id: req.body.ProfileId },
          { $push: { plants: plant._id } },
          { new: true }
        );
      })
      .then((profile) =>
        !profile
          ? res.status(404).json({
              message: "Plant created, but found no profile with that ID",
            })
          : res.json("Posted the plant 🎉")
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a plant
  deletePlant(req, res) {
    Plant.findOneAndDelete({ _id: req.params.plantId })
      .then((plant) =>
        !plant
          ? res.status(404).json({ message: "No plant with that ID" })
          : Plant.deleteMany({ _id: { $in: plant.plants } })
      )
      .then(() => res.json({ message: "Plant and reactions deleted." }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a plant
  updatePlant(req, res) {
    Plant.findOneAndUpdate(
      { _id: req.params.plantId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((plant) =>
        !plant
          ? res.status(404).json({ message: "No plant with that ID." })
          : res.json(plant)
      )
      .catch((err) => res.status(500).json(err));
  },

  // TODO: Add species to plant
};
