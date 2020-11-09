const { Sequelize } = require('sequelize');
const options = require ('../db/models/options.js');
const path = require('path');
require('dotenv').config({  path: path.resolve(__dirname, '../.env') });

const connection = new Sequelize('option', process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false
  },
})

let OptionsModel = options.factory(connection);

connection
  .authenticate()
  .then(()=>{
    return connection.sync()
  })
  .catch((err)=> {
    console.log(err);
  });

module.exports.OptionsModel = OptionsModel;
module.exports.connection = connection;