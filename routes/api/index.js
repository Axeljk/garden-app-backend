const router = require('express').Router();
const profile = require("./profileRoutes");

router.use("/profiles", profile);

module.exports = router;

router.use('/profiles', profileRoutes);
router.use('/layouts', layoutRoutes);
router.use('/plants', plantRoutes);