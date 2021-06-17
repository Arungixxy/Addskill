const User = require("../models/user");
const Meal = require("../models/meal");
const User_functions = require("./user_controller.js");
var express = require("express");

var NutritionixClient = require("nutritionix");
var nutritionix = new NutritionixClient({
    appId: process.env.APPID,
    appKey: process.env.APPKEY,
});

const getFoodCalories = async (food_name) => {
    console.log(`getFoodCalories called with ${food_name} foodname`);
    return new Promise((resolve, reject) => {
        nutritionix
            .search({
                q: food_name,
                // use these for paging
                limit: 1,
                offset: 0,
                // controls the basic nutrient returned in search
                search_nutrient: "calories",
                // use these for paging
                // search_nutrient: 'calories'
            })
            .then((res) => {
                resolve(res["results"][0]["nutrient_value"]);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const createMeal = async (curr_name, calories, user_id) => {
    console.log(
        `createMeal called with ${curr_name} foodname , ${calories} calories and ${user_id} user id`
    );
    if (calories == null || calories == 0 || calories == undefined) {
        calories = await getFoodCalories(curr_name);
    }
    User_functions.addUserCalories(user_id, parseInt(calories));
    return new Promise((resolve, reject) => {
        Meal.create({
            food_name: curr_name,
            calories: calories,
            user_id: user_id,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const updateMeal = async (meal_id, curr_name, calories) => {
    if (calories == null || calories === 0 || calories == undefined) {
        calories = await getFoodCalories(curr_name);
    }
    return new Promise((resolve, reject) => {
        Meal.update(
            {
                food_name: curr_name,
                calories: calories,
            },
            {
                where: {
                    meal_id: meal_id,
                },
            }
        )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                console.log("Error in Update Meal", err);
                reject("Error in Update Meal", err);
            });
    });
};

const getMealById = (curr_meal_id) => {
    console.log(`getMealById called with ${curr_meal_id} userid`);

    return new Promise((resolve, reject) => {
        Meal.findOne({
            where: {
                meal_id: curr_meal_id,
            },
        })
            .then((meal) => {
                if (meal.length == 0) {
                    resolve("User does not exist");
                }
                resolve(meal);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports = {
    getFoodCalories,
    createMeal,
    updateMeal,
    getMealById,
};
