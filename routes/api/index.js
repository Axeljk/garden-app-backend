const router = require('express').Router();
const profileRoutes = require("./profileRoutes");
const layoutRoutes = require("./layoutRoutes");
const plantRoutes = require("./plantRoutes");

router.use("/profiles", profileRoutes);
router.use('/layouts', layoutRoutes);
router.use('/plants', plantRoutes);

module.exports = router;
