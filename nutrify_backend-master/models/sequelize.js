const Sequelize = require('sequelize');

////////////////////// offline SQl
const sequelize = new Sequelize(process.env.DB_Name, process.env.DB_USER,process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'mysql'
});
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
sequelize.sync();
//////////////////////////////////

////////////////////// Online heroku
// const sequelize = new Sequelize('heroku_91ac32a8079d0b8', 'b526a666132f89', '49414326', {
//     host: 'us-cdbr-east-06.cleardb.net',
//     dialect: 'mysql'
// });
// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });
// sequelize.sync();
//////////////////////////////////


module.exports = sequelize;

// mysql://b526a666132f89:49414326@us-cdbr-east-06.cleardb.net/heroku_91ac32a8079d0b8?reconnect=true