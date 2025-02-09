const express = require('express');
const router = express.Router();
const dataController = require('../controller/dataController');


router.get('/countries', dataController.getCountries);
router.get('/countries/states', dataController.getStates);
router.get('/states/cities', dataController.getCities);

module.exports = router;