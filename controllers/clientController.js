const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const serverSecrets = require('../util/serverSecrets');

const ClientModel = require('../models/clientModel');


exports.createClient = (req, res, next) => {  
    const generatedSecret =  serverSecrets.generateSecret(20);
    bcryptjs.hash(generatedSecret, 12).then(hashedSecret => {
      ClientModel.create({
        client_secret: hashedSecret
      }).then(client => {
          res.status(200).send({
              status: {
                code: 200,
                message: 'OK'
              },
              data: {
                client_id: client.client_id,
                client_secret: generatedSecret
              }
            });
      }).catch(error => {
          res.status(500).send({
              status: {
                code: 500,
                message: 'Internal server error (2)'
              },
              data: {
                  error
              }
            });
      });
    }).catch(error => {
      res.status(500).send({
        status: {
          code: 500,
          message: 'Internal server error (1)'
        },
        data: {
            error
        }
      });
    });    
};

exports.getClientById = (req, res, next) => {
  const client_id = req.client_id;
  ClientModel.findByPk(client_id).then(client => {
    if (client) {
      res.status(200).send({
        status: {
          code: 200,
          message: 'OK'
        },
        data: {
          client
        }
      });
    } else {
      res.status(200).send({
        status: {
          code: 404,
          message: 'Not found'
        }
      });
    }    
  }).catch(error => {
    res.status(500).send({
        status: {
          code: 500,
          message: 'Internal server error'
        },
        data: {
            error
        }
      });
  });
};

exports.deleteClientById = (req, res, next) => {
  const client_id = req.client_id;
  ClientModel.destroy({ where: { client_id } }).then(deletet_rows => {
    if (deletet_rows) {
      console.log(deletet_rows);
      res.status(200).send({
        status: {
          code: 200,
          message: 'OK'
        },
        data: {
          deletet_rows
        }
      });
    } else {
      res.status(200).send({
        status: {
          code: 404,
          message: 'Not found'
        }
      });
    }    
  }).catch(error => {
    res.status(500).send({
        status: {
          code: 500,
          message: 'Internal server error'
        },
        data: {
            error
        }
      });
  });
};

exports.clientLogin = (req, res, next) => {
  const client_id = req.body.client_id;
  const client_secret = req.body.client_secret;
  ClientModel.findByPk(client_id).then(client => {
    if (client) {
      return bcryptjs.compare(client_secret, client.client_secret);
    } else {
      return false;
    }    
  }).then(isEqual => {
    if (!isEqual) {
      res.status(200).send({
        status: {
          code: 401,
          message: 'Not authenticated'
        }
      });
    } else {
      const token = jsonwebtoken.sign({ client_id }, 'secret', { expiresIn: '1h'});
      res.status(200).send({
        status: {
          code: 200,
          message: 'OK'
        },
        data: {
          token
        }
      });
    }
  }).catch(error => {
    console.log('->' + error);
    res.status(500).send({
        status: {
          code: 500,
          message: 'Internal server error'
        },
        data: {
            error
        }
      });
  });
};