const path = require('path');
// openPGP
const openpgp = require('openpgp');
// load environment
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, './server.env') });

const bodyParser = require('body-parser');
const express = require('express');
const { restart } = require('nodemon');

const sequelize = require('./util/database');
// models have to be imported for sync method.
const serverModel = require('./models/serverModel');
const clientModel = require('./models/clientModel');

// routes
const utilRoutes = require("./routes/utilRoutes");
const serverRoutes = require("./routes/serverRoutes");
const clientRoutes = require("./routes/clientRoutes");
const ejsController = require("./controllers/ejsController");
const ServerModel = require('./models/serverModel');

const app = express();
const port = parseInt(process.env.PORT) || 3000;

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('domain', process.env.DOMAIN)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json())

// serve static assets
app.use(express.static(path.join(__dirname, '/public')));

// routes
app.use('/utils', utilRoutes);
app.use('/server', serverRoutes);
app.use('/client', clientRoutes);
app.get('/', ejsController.renderIndex);

// 404 page
app.use(ejsController.render404);

// create OpenPGP key pair on each start  
  openpgp.generateKey({
      type: 'ecc', // Type of the key, defaults to ECC
      curve: 'curve25519', // ECC curve name, defaults to curve25519
      userIDs: [{ name: process.env.NAME, email: process.env.EMAIL }], // you can pass multiple user IDs
      passphrase: process.env.SECRET, // protects the private key
      format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
  }).then(openPGP => {
    // save openPGP-Keys
    app.set('privateKey', openPGP.privateKey);
    app.set('publicKey', openPGP.publicKey);
    app.set('revocationCertificate',  openPGP.revocationCertificate); 
    // connect to database
    sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      // create tables if needed
      sequelize.sync({ force: false }).then(result => {
        console.log('Sync successfully finished.');
        // Save keys in database
        ServerModel.upsert({
          server_domain : process.env.DOMAIN,
          server_publicKey : app.get("publicKey")
        }).then(([instance, created]) => {
          // start server
          app.listen(port, () => {
          console.log(`Example app listening on port ${port}`);
          // console.log(privateKey);     // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
          // console.log(publicKey);      // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
          // console.log(revocationCertificate); // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
        });
        }).catch(err => {
          console.error('Unable to update server data:', err);
        });        
      }).catch(error => {
        console.log('Unable to sync. Error:');
        console.log(error);
      });
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  }).catch(error => {
    console.log('Unable to create openPGP key pari. Error:');
    console.log(error);
  });
