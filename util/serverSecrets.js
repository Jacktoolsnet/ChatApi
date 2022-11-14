const crypto = require('crypto');

function generateSecret(length) {
    let charPool = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_abcdefghijklmnopqrstuvwxyz{|}`
    return Array.from(crypto.randomFillSync(new Uint32Array(length)))
        .map((x) => charPool[x % charPool.length])
        .join('')
  };

  exports.generateSecret = generateSecret;
