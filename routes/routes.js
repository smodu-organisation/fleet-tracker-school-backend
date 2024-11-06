const express = require('express');
const routeController = require('../controllers/routeController');
const router = express.Router();

router.post('/add', routeController.addRoute);
router.get('/', routeController.getAllRoutes);

module.exports = router;