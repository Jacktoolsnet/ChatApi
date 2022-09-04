const Sequelize = require('sequelize');

const sequelize = new Sequelize('chatapi', 'chatApi', '1234', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;