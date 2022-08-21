const express = require('express');

const router = express.Router();

router.get('/getClientIp', (req, res, next) => {
    res.status(200).send('GetClientIp works!');
  });

module.exports = router;