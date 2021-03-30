const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/database');

const User = require('./User');
const Book = require('./Book');


// Associations
User.hasMany(Book, {
    foreignKey: 'userId'
})
Book.belongsTo(User);

//to create data models
db.sync({ alter: true });
