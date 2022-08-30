const router = require('express').Router();
const profile = require("./profileRoutes");

router.use("/profiles", profile);

module.exports = router;
