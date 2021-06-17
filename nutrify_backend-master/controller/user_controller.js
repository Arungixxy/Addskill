const User = require("../models/user");
const Meal = require("../models/meal");

var express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

const jwt = require("jsonwebtoken");

const getAllUsers = async () => {
    return new Promise((resolve, reject) => {
        User.findAll()
            .then((users) => {
                resolve(users);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const addUser = async (
    curr_name,
    curr_email,
    curr_password,
    curr_total_calories
) => {
    const check_unique_email = await getUserByEmail(curr_email);
    const hashed_password = bcrypt.hashSync(curr_password, saltRounds);
    return new Promise((resolve, reject) => {
        if (check_unique_email == -1) {
            console.log("Email already exists.");
            reject({
                err: "Email already exists.",
            });
        }
        User.create({
            name: curr_name,
            email: curr_email,
            password: hashed_password,
            max_calories: curr_total_calories,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const addUserCalories = async (user_id, calories) => {
    console.log(
        `addUserCalories called with ${user_id} userid and ${calories} caories`
    );
    await updateUserCalories(user_id);
    let user_curr_calories = await getUserCurrCalories(user_id);
    tot_cals = user_curr_calories + calories;
    console.log("+++++++++++++++++++++++",typeof user_curr_calories ,typeof calories);
    return new Promise((resolve, reject) => {
        User.update(
            {
                current_calories: tot_cals,
            },
            {
                where: {
                    user_id: user_id,
                },
            }
        )
            .then((res) => {
                resolve(res);
            })
            .catch((err) => reject(err));
    });
};

const getUserCurrCalories = (curr_usr_id) => {
    console.log(`getUserCurrCalories called with ${curr_usr_id} userid`);

    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                user_id: curr_usr_id,
            },
        })
            .then((user) => {
                resolve(user["current_calories"]);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
const getUserById = (curr_usr_id) => {
    console.log(`getUserById called with ${curr_usr_id} userid`);

    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                user_id: curr_usr_id,
            },
        })
            .then((user) => {
                if (user.length == 0) {
                    resolve("User does not exist");
                }
                resolve(user);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
const getUserByEmail = (curr_email) => {
    console.log(`getUserByEmail called with ${curr_email} curr_email`);

    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                email: curr_email,
            },
        })
            .then((user) => {
                if (user === null || user.length == 0) {
                    resolve("User does not exist");
                }
                resolve(-1);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
const checkUserExists = (user_id) => {
    console.log(`checkUserExists called with ${user_id} userid`);
    return new Promise((resolve, reject) => {
        User.findAll({
            where: {
                user_id: user_id,
            },
        })
            .then((user) => {
                if (user.length == 0) {
                    resolve(-1);
                } else {
                    resolve(user);
                }
            })
            .catch((err) => reject(err));
    });
};

const updateUserCalories = async (Curruser_id) => {
    const curr_calorie = await getAllCaloriesOfOneUser(Curruser_id);

    return new Promise((resolve, reject) => {
        console.log("curr_calorie = ", curr_calorie);
        console.log("Curr user = ",typeof Curruser_id);
        User.update(
            {
                "current_calories": curr_calorie,
            },
            {
                where: { "user_id": Curruser_id },
            }
        )
            .then((res) => {
                User.findAll({
                    where: {
                        user_id: Curruser_id,
                    },
                })
                .then(user=>{
                    console.log(user)
                    resolve(res);
                })
                .catch(err=>{
                    reject(err)
                })
                
            })
            .catch((err) => {
                reject(err);
            });
    });
};

const getAllCaloriesOfOneUser = async (user_id) => {
    return new Promise((resolve, reject) => {
        Meal.findAll({
            where: {
                user_id: user_id,
            },
        })
            .then((meals) => {
                if (meals.length == 0) {
                    reject(0);
                } else {
                    let curr_calorie = 0;
                    meals.forEach((meal) => {
                        curr_calorie += meal["calories"];
                    });
                    console.log("Tatal meal cals : ", curr_calorie);
                    resolve(curr_calorie);
                }
            })
            .catch((err) => reject(err));
    });
};

const loginUser = async (req, email, pasword) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                email: email,
            },
        })
            .then((user) => {
                if (user === null || user.length == 0) {
                    return resolve(false);
                }
                return user;
            })
            .then((user) => {
                console.log(pasword, user["password"]);
                bcrypt
                    .compare(pasword, user["password"])
                    .then(function (result) {
                        if (result == false || result === false) {
                            resolve(false);
                        }
                        resolve(user);
                    });
            })
            .catch((err) => reject(err));
    });
};

const requiresLogin = (req, res, next) => {
    // Get auth header value
    const token = req.header("auth_token");
    if (!token) {
        return res.status(401).json({
            error: "You do not have permission",
        });
    }
    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        console.log("User is logged in !!");
        next();
    } catch (err) {
        res.status(400).json({
            error: "Invalid token",
        });
    }
};

const authorise = (req, res, user_id) => {
    const token = req.header("auth_token");
    if (!token) {
        console.log("Token not found");
        return false;
    }
    try {
        const decoded = jwt.decode(token);
        let current_user_id = decoded["user_id"];
        current_user_id = parseInt(current_user_id);
        console.log(current_user_id, parseInt(user_id));
        if (current_user_id == parseInt(user_id)) {
            return true;
        }
        return false;
    } catch (err) {
        return err;
    }
};

const getUserIdFromJWT = (req, res) => {
    const token = req.header("auth_token");
    return new Promise((resolve, reject) => {
        if (!token) {
            reject(false);
        }
        try {
            const decoded = jwt.decode(token);
            const current_user_id = decoded["user_id"];

            resolve(current_user_id);
        } catch (err) {
            reject(false);
        }
    });
};

module.exports = {
    addUserCalories,
    getUserCurrCalories,
    checkUserExists,
    updateUserCalories,
    getAllCaloriesOfOneUser,
    getAllUsers,
    addUser,
    getUserById,
    loginUser,
    requiresLogin,
    getUserByEmail,
    authorise,
    getUserIdFromJWT,
};
