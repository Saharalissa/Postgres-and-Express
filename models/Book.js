const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/database');

const Book = db.define('books', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        // For uniquely identify user.
        primaryKey:true
      },
    name: {
      type: DataTypes.STRING,
    }
});

// Book.associate = models => {
//   Book.belongsTo(models.User, {
//     foreignKey: 'userId'
//   });
// }

// Book.sync({ force: true });
module.exports = Book;