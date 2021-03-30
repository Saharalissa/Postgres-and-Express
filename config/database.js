const Sequelize = require('sequelize')

//These arguments are brought from pgAdmin
module.exports = new Sequelize('assignment1','postgres', '1234', {
    host: 'localhost',
    //This port is brought up from connection tab in pgAdmin
    port: 5435,
    dialect:'postgres',
    
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    },
});
