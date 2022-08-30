const router = require("express").Router();
const {
	getLayout,
	createLayout,
	editLayout,
	deleteLayout
} = require("../../controllers/layoutController.js");

//	[base_url]/api/layouts
router.route("/").post(createLayout);

//	[base_url]/api/layouts/:id
router.route("/:id")
	.get(getLayout)
	.put(editLayout)
	.delete(deleteLayout);

module.exports = router;