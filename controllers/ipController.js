exports.getClientIp = (req, res, next) => {
    const client_ip = req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
    res.status(200).send({
      status: {
        code: 200,
        message: 'OK'
      },
      data: {
        client_ip
      }
    });
  }