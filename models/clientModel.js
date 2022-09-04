const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const ClientModel = sequelize.define('client', {
    client_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    client_secret: {
        type: Sequelize.STRING,
        allowNull: false
    }
  });

  module.exports = ClientModel;