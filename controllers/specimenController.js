const { ObjectId } = require("mongoose").Types;
const { Plant, Garden, Specimen } = require("../models");

module.exports = {

  // Get a specimen
  getSingleSpecimen(req, res) {
    Specimen.findOne({ _id: req.params.specimenId }).populate("plant")
      .select("-__v")
      .then((specimen) => {
        if (!specimen) {
          return res.status(404).json({ message: "There is no specimen with this id." });
        }
        res.json(specimen);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Create a specimen attached to a garden
  createSpecimen(req, res) {
    Specimen.create(req.body)
      .then((specimen) => {
		let index = `specimens.${req.body.index}`;
        Garden.findOneAndUpdate(
          { _id: req.body.gardenId },
          { $set: { index : specimen._id } },
          { new: true }
        ).then((garden) =>
          !garden
          ? res.status(404).json({
              message: "Specimen created, but found no garden with that ID",
            })
          : res.json(specimen)
        );
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a specimen
  deleteSpecimen(req, res) {
    Specimen.findOneAndDelete({ _id: req.params.specimenId })
      .then((specimen) =>
        !specimen
          ? res.status(404).json({ message: "No specimen with that ID" })
          : Specimen.deleteMany({ _id: { $in: specimen.specimens } })
      )
      .then(() => res.json({ message: "Specimen and reactions deleted." }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a specimen
  updateSpecimen(req, res) {
    Specimen.findOneAndUpdate(
      { _id: req.params.specimenId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((specimen) =>
        !specimen
          ? res.status(404).json({ message: "No specimen with that ID." })
          : res.json(specimen)
      )
      .catch((err) => res.status(500).json(err));
  },
};
