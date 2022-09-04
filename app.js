const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const { restart } = require('nodemon');

const sequelize = require('./util/database');
const clientModel = require('./models/clientModel');

const utilRoutes = require("./routes/utilRoutes");
const clientRoutes = require("./routes/clientRoutes");
const ejsController = require("./controllers/ejsController");

const app = express();
const port = 3000;

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', 'views');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json())

// serve static assets
app.use(express.static(path.join(__dirname, '/public')));

// routes
app.use('/utils', utilRoutes);
app.use('/client', clientRoutes);
app.get('/', ejsController.renderIndex);

// 404 page
app.use(ejsController.render404);

// connect to database
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    // create tables if needed
    sequelize.sync({ force: false }).then(result => {
      console.log('Sync successfully finished.');
      // start server
      app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
      });
    }).catch(error => {
      console.log('Unable to sync. Error:');
      console.log(error);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

