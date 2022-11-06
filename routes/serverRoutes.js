const express = require('express');

const router = express.Router();
const serverController = require('../controllers/serverController')

router.get('/getStatus', serverController.getStatus);

module.exports = router;