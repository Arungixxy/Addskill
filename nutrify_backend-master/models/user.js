const sequelize = require('./sequelize')
const Sequelize = require('sequelize');
const Meal = require('./meal');

const User = sequelize.define('user', {
    // attributes

    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING
    },
    current_calories: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    max_calories: {
        type: Sequelize.INTEGER,
        defaultValue: 2000
    },
    calories_exceeded: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});
User.hasMany(Meal,{as: 'fotos', foreignKey: 'user_id'})

module.exports = User;