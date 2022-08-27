exports.getClientIp = (req, res, next) => {
    // X-Real-IP: $remote_addr;
    // X-Forwarded-For: $proxy_add_x_forwarded_for;
    // X-Forwarded-Host: $server_name;
    const x_real_ip = req.headers['x-real-ip'];
    const x_forwarded_for = req.headers['x-forwarded-for']?.split(',').shift();
    const x_forwarded_host = req.headers['x-forwarded-host'];
    res.status(200).send({
      status: {
        code: 200,
        message: 'OK'
      },
      data: {
        client_ip: req.ip,
        x_real_ip,
        x_forwarded_for,
        x_forwarded_host,
        headers: req.headers
      }
    });
  }