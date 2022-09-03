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

module.exports = router;
