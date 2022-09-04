const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // get header
    const authorizationHeader = req.get('Authorization');
    if (authorizationHeader){
        // get token
        const token = req.get('Authorization').split(' ')[1];
        let decodedToken;
        try {
            // verify token
            decodedToken = jsonwebtoken.verify(token, 'secret');
        } catch (error) {
            // can't verify token
            res.status(200).send({
                status: {
                  code: 401,
                  message: 'Not authenticated'
                }
            });
        }
        if (!decodedToken) {
            // wrong token
            res.status(200).send({
                status: {
                  code: 401,
                  message: 'Not authenticated'
                }
            });
        }
        // token verified. Add client_id to request
        req.client_id = decodedToken.client_id;        
        next();
    } else {
        // missing header
        res.status(200).send({
            status: {
              code: 401,
              message: 'Not authenticated'
            }
        });
    }
};