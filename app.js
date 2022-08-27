const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const { restart } = require('nodemon');

const getClientIpRoutes = require("./routes/getClientIp");
const ejsController = require("./controllers/ejsController");

const app = express();
const port = 3000;

app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(getClientIpRoutes);

app.get('/', ejsController.renderIndex);

app.use(ejsController.render404);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});