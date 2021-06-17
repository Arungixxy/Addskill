import React, { useState,useEffect } from "react";
// import ReactDOM from 'react-dom';
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { isLogin } from "./utils/auth.js";
import {
    BrowserRouter as Router,
    useHistory,
    withRouter,
} from "react-router-dom";
//   import dotenv from  'dotenv'

const Meal = (props) => {
    console.log("Props  =",props)
    const [meal, setMeal] = useState(props.curr_list.meal);
    const [displayeditpage, setDisplayeditpage] = useState(false);
    const [isdeleted, setisdeleted] = useState(false);
    const url = props.curr_list.url;
    const toggleButtonEditMeal = () => {
        // this.setState((currentState) => ({
        //     displayeditpage: !currentState.displayeditpage,
        // }));
        setDisplayeditpage((currentIsOpen) => !currentIsOpen);
    };

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    // };
    const changeMealData = (mealId, mealName, MealCals) => {
        const token = localStorage.getItem("auth_token");
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json", auth_token: token },
            body: JSON.stringify({ food_name: mealName, calories: MealCals }),
        };

        let first = process.env.REACT_APP_URL;
        let second_arg = "meals/" + mealId;
        let url = first + second_arg;
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if ("error" in data) {
                    console.log(data);
                } else {
                    setMeal(data)
                    // this.setState({ meal: data });
                    toggleButtonEditMeal();
                }
            });
    };

    const deletemeal = (mealId) => {
        const token = localStorage.getItem("auth_token");
        const requestOptions = {
            method: "DELETE",
            headers: { "Content-Type": "application/json", auth_token: token },
            body: JSON.stringify(),
        };

        let first = process.env.REACT_APP_URL;
        let second_arg = "meals/"+mealId;
        let url = first + second_arg;
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if ("error" in data) {
                    console.log(data);
                } else {
                    setisdeleted(true);
                    // this.setState({ isdeleted: true });
                }
            });
    };
    return (
        <div>
            {isdeleted ? (
                <div></div>
            ) : (
                <div style={{ height: "auto" }}>
                    {!displayeditpage ? (
                        <ShowMealProp
                            meal={meal}
                            url={url}
                            toggleeditshow={toggleButtonEditMeal}
                            deletemeal={deletemeal}
                        />
                    ) : (
                        <EditMealProp
                            meal={meal}
                            url={url}
                            toggleeditshow={toggleButtonEditMeal}
                            changeMealDataprop={changeMealData}
                        />
                    )}
                </div>
            )}
        </div>
    );
};


const ShowMealProp = (props) => {
    console.log("Show meal prop",props)
    const meal = props.meal;
    const meal_id = meal.meal_id;

    const url = props.url;

    return (
        <div>
            <p>
                <span style={{ display: "block" }}>
                    Food name :{" "}
                    <a href={url + meal.meal_id}>{meal.food_name} </a>
                </span>
                <span>Calories : {meal.calories}</span>
            </p>
            <div style={{ display: "flex" }}>
                <button
                    className="form-control btn btn-outline-warning"
                    style={{ display: "inline-block" }}
                    onClick={() => props.toggleeditshow(meal_id)}
                >
                    Edit Meal
                </button>
                <button
                    className="form-control btn btn-outline-danger"
                    style={{ display: "inline-block" }}
                    onClick={() => props.deletemeal(meal_id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

const EditMealProp = (props) => {
    const meal = props.meal;

    const [currMealName, newMealName] = useState(props.meal.food_name);

    const [mealCal, newMealCal] = useState(props.meal.calories);

    const handleSubmit = (values) => {
        values.preventDefault();
    };

    return (
        <div style={{ height: "auto" }}>
            <form
                className="form-control"
                onSubmit={handleSubmit}
                style={{ height: "auto" }}
            >
                <input
                    className="form-control "
                    type="text"
                    placeholder="Enter  Foodname"
                    name="email"
                    value={currMealName}
                    onChange={(e) => newMealName(e.target.value)}
                />

                <input
                    className="form-control "
                    type="number"
                    placeholder="Enter calories"
                    name="password"
                    value={mealCal}
                    onChange={(e) => newMealCal(e.target.value)}
                />

                <div style={{ display: "flex" }}>
                    <button
                        className="form-control btn btn-outline-warning"
                        style={{ display: "inline-block" }}
                        onClick={() => props.toggleeditshow()}
                    >
                        Cancel
                    </button>
                    <button
                        className="form-control btn btn-outline-danger"
                        style={{ display: "inline-block" }}
                        onClick={() =>
                            props.changeMealDataprop(
                                meal.meal_id,
                                currMealName,
                                mealCal
                            )
                        }
                    >
                        Edit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default withRouter(Meal);
