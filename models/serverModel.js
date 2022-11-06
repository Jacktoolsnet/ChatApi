const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const ServerModel = sequelize.define('server', {
    server_domain: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    server_publicKey: {
        type: Sequelize.TEXT,
        allowNull: false
    }
  });

  module.exports = ServerModel;