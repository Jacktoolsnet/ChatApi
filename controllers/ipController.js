exports.getClientIp = (req, res, next) => {
    //For this solution proxy_set_header X-Real-IP $remote_addr; have to be set in the 
    const x_real_ip = req.headers['x-real-ip']?.split(',').shift();
    const x_forwarded_for = req.headers['x-forwarded-for']?.split(',').shift();
    const x_forwarded_host = req.headers['x-forwarded-host']?.split(',').shift();
    res.status(200).send({
      status: {
        code: 200,
        message: 'OK'
      },
      data: {
        x_real_ip,
        x_forwarded_for,
        x_forwarded_host
      }
    });
  }