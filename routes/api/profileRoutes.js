const router = require("express").Router();
module.exports = router;

const {
  getAllProfiles,
  createProfile,
    getSingleProfile,
    loginProfile,
    updateProfile,
    deleteProfile,
} = require("../../controllers/profileController.js");

// /api/profiles
router.route("/").get(getAllProfiles).post(createProfile);

///api/profiles/:profileId
router
  .route("/:profileId")
  .get(getSingleProfile)
  .post(loginProfile)
  .put(updateProfile)
  .delete(deleteProfile);

module.exports = router;
