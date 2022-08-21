const path = require('path');

const bodyParser = require('body-parser');
const express = require('express');
const { restart } = require('nodemon');

const getClientIpRoutes = require("./routes/getClientIp")

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(getClientIpRoutes);

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'))
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});