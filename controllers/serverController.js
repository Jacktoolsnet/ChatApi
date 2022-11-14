const openpgp = require('openpgp');

exports.getPublicKey = (req, res, next) => { 
  res.status(200).send({
    status: {
      code: 200,
      message: 'OK'
    },
    data: {
      publicKey: req.app.get('publicKey')
    }
  });
};

exports.getStatus = (req, res, next) => { 
  (async () => {
    const publicKeyArmored = req.app.get('publicKey');
    const privateKeyArmored = req.app.get('privateKey'); // encrypted private key
    const passphrase = req.app.get('secret'); // what the private key is encrypted with

    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
    });

    const encrypted = await openpgp.encrypt({
        message: await openpgp.createMessage({ text: "A very secret test message" }), // input as Message object
        encryptionKeys: publicKey,
        signingKeys: privateKey // optional
    });
    console.log(encrypted); // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'

    res.status(200).send({
      status: {
        code: 200,
        message: 'OK'
      },
      data: {
        domain: req.app.get('domain'),
        encryptedTestMessage: encrypted
      }
    });
})();
};

exports.decryptTestMessage = (req, res, next) => {

  const encrypted = req.body.encryptedTestMessage;
  console.log(encrypted);
  (async () => {
    
    try {

      const publicKeyArmored = req.app.get('publicKey');
      const privateKeyArmored = req.app.get('privateKey'); // encrypted private key
      const passphrase = req.app.get('secret'); // what the private key is encrypted with

      const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

      const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
      });
      
      const message = await openpgp.readMessage({
        armoredMessage: req.body.encryptedTestMessage // parse armored message
      });

      const { data: decrypted, signatures } = await openpgp.decrypt({
          message,
          verificationKeys: publicKey, // optional
          decryptionKeys: privateKey
      });

      await signatures[0].verified; // throws on invalid signature
      console.log('Signature is valid');
      res.status(200).send({
        status: {
          code: 200,
          message: 'OK'
        },
        data: {
          domain: req.app.get('domain'),
          decryptedTestMessage: decrypted,
          validSignature: true
        }
      });
    } catch (e) {
      res.status(200).send({
        status: {
          code: 500,
          message: e.message
        },
        data: {
          domain: req.app.get('domain')
        }
      });
    }    
})();
};
