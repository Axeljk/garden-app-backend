const router = require('express').Router();
const userRoutes = require("./userRoutes");
const gardenRoutes = require("./gardenRoutes");
const specimenRoutes = require("./specimenRoutes");
const plantRoutes = require("./plantRoutes");

router.use("/users", userRoutes);
router.use('/gardens', gardenRoutes);
router.use('/specimens', specimenRoutes);
router.use('/plants', plantRoutes);

module.exports = router;
