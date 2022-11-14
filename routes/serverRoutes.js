const express = require('express');

const router = express.Router();
const serverController = require('../controllers/serverController')

router.get('/getStatus', serverController.getStatus);
router.get('/getPublicKey', serverController.getPublicKey);
router.post('/encryptedTestMessage', serverController.decryptTestMessage);

module.exports = router;