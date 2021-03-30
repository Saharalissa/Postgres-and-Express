const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/database');
// const Book = require('./Book');
//This table is created manually on pgAdmin
const User = db.define('users', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement:true,
      allowNull:false,
      // For uniquely identify user.
      primaryKey:true
    },
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    email: {
      type: DataTypes.STRING,
      allowNull:false
    },
    password: {
      type: DataTypes.STRING,
      allowNull:false
    }
});

// User.sync({ force: true });
module.exports = User;

// module.exports = (Sequelize, DataTypes) => {
//   const User = Sequelize.define("User", {
//     // id:{
//     //   type: DataTypes.INTEGER,
//     //   autoIncrement:true,
//     //   allowNull:false,
//     //   // For uniquely identify user.
//     //   primaryKey:true
//     // },
//     name: {
//       type: DataTypes.STRING,
//       allowNull:false
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull:false
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull:false
//     }
// });

// User.associate = models => {
//   User.hasMany(models.Book, {
//     onDelete: "RESTRICT",
//     onUpdate: 'RESTRICT'
//   });
// }
//   return User;
// }