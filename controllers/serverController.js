exports.getStatus = (req, res, next) => { 
  res.status(200).send({
    status: {
      code: 200,
      message: 'OK'
    },
    data: {
      domain: req.app.get('domain'),
      publicKey: req.app.get('publicKey')
    }
  });    
};
