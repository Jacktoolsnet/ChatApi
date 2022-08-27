exports.getClientIp = (req, res, next) => {
    //For this solution proxy_set_header X-Real-IP $remote_addr; have to be set in the server settings.
    const client_ip = req.headers['x-real-ip']?.split(',').shift() || req.socket?.remoteAddress;
    res.status(200).send({
      status: {
        code: 200,
        message: 'OK'
      },
      data: {
        client_ip,
        local: req.socket.localAddress
      }
    });
  }