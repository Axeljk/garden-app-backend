const router = require('express').Router();

module.exports = router;

router.use('/profiles', profileRoutes);
router.use('/layouts', layoutRoutes);
router.use('/plants', plantRoutes);