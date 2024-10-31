const express = require('express');
const router = express.Router();
const dataController = require('../controller/dataController');


router.get('/dropdown', dataController.getData);


router.get('/', (req, res) => {
    res.redirect('/dropdown');
});

module.exports = router;