const express = require('express');

const router = express.Router();
const utilController = require('../controllers/utilController')

router.get('/getClientIp', utilController.getClientIp);

module.exports = router;