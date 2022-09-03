const router = require("express").Router();
module.exports = router;

const {
    getAllUsers,
    createUser,
    checkToken,
    getSingleUser,
    loginUser,
    updateUser,
    deleteUser,
} = require("../../controllers/userController.js");

// /api/users
router.route("/").get(getAllUsers).post(createUser);

// /api/users/token
router.route("/token").get(checkToken);

// /api/users/login
router.route("/login").post(loginUser);

///api/users/:userId
router
  .route("/:userId")
  .get(getSingleUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
