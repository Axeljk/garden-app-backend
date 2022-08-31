const router = require("express").Router();
module.exports = router;

const {
    getAllProfiles,
    createProfile,
    checkToken,
    getSingleProfile,
    loginProfile,
    updateProfile,
    deleteProfile,
} = require("../../controllers/profileController.js");

// /api/profiles
router.route("/").get(getAllProfiles).post(createProfile);

// /api/profiles/token
router.route("/token").get(checkToken);

// /api/profiles/login
router.route("/login").post(loginProfile);

///api/profiles/:profileId
router
  .route("/:profileId")
  .get(getSingleProfile)
  .put(updateProfile)
  .delete(deleteProfile);

module.exports = router;
