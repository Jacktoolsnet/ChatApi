const express = require('express');

const router = express.Router();
const ipController = require('../controllers/ipController')

router.get('/getClientIp', ipController.getClientIp);

module.exports = router;