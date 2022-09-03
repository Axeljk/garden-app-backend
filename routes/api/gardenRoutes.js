const router = require("express").Router();
const {
	getGarden,
	createGarden,
	editGarden,
	deleteGarden
} = require("../../controllers/gardenController.js");

//	[base_url]/api/gardens
router.route("/").post(createGarden);

//	[base_url]/api/gardens/:id
router.route("/:id")
	.get(getGarden)
	.put(editGarden)
	.delete(deleteGarden);

module.exports = router;