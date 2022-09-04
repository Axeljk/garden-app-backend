const { ObjectId } = require("mongoose").Types;
const { User, Plant, Specimen } = require("../models");

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
  // Create a plant attached to a user
  createPlant(req, res) {
    Plant.create(req.body)
      .then((plant) => {
        return [User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { plants: plant._id } },
          { new: true }
        ), plant]
      })
      .then((data) =>
        !data[0]
          ? res.status(404).json({
              message: "Plant created, but found no user with that ID",
            })
          : res.json(data[1])
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
};
