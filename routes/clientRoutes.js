const express = require('express');
const checkToken = require('../util/checkToken')

const router = express.Router();
const clientController = require('../controllers/clientController')

router.get('/create', clientController.createClient);
router.post('/login', clientController.clientLogin);
router.get('/get', checkToken, clientController.getClientById);
router.get('/delete', checkToken, clientController.deleteClientById);


module.exports = router;