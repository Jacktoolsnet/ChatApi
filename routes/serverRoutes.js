const express = require('express');

const router = express.Router();
const serverController = require('../controllers/serverController')

router.get('/getPublicKey', serverController.getPublicKey);
router.get('/encryptTestMessage', serverController.getEncryptTestMessage);
router.post('/decryptedTestMessage', serverController.decryptTestMessage);

module.exports = router;