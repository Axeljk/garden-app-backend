const router = require("express").Router();
module.exports = router;

const {
    getSinglePlant,
    createPlant,
    deletePlant,
    updatePlant
} = require("../../controllers/plantController.js");

// /api/plants
router.route("/").post(createPlant);

///api/plants/:plantId
router
  .route("/:plantId")
  .get(getSinglePlant)
  .put(updatePlant)
  .delete(deletePlant);

// TODO: For future use
// // /api/plants/:plantId/species
// router.route("/:plantId/species").post(addSpecies);

module.exports = router;
