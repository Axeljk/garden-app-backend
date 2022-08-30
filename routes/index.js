const express = require("express");
const router = express.Router();

router.use('/api', apiRoutes);
router.use((req, res) => res.send('Wrong route!'));

module.exports = router;

