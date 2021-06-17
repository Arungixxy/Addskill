const sequelize = require('./sequelize')
const Sequelize = require('sequelize');
const User = require('./user');

const Meal = sequelize.define('meal', {
    // attributes
    
    meal_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    food_name: {
        type: Sequelize.STRING,
        allowNull: false               
    },
    calories: {
        type: Sequelize.INTEGER,
        defaultValue:0
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
module.exports = Meal;