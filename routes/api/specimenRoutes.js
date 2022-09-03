const router = require("express").Router();
module.exports = router;

const {
    getSingleSpecimen,
    createSpecimen,
    deleteSpecimen,
    updateSpecimen
} = require("../../controllers/specimenController.js");

// /api/specimens
router.route("/").post(createSpecimen);

///api/specimens/:specimenId
router
  .route("/:specimenId")
  .get(getSingleSpecimen)
  .put(updateSpecimen)
  .delete(deleteSpecimen);

module.exports = router;
