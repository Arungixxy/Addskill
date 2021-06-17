import React, { useState, useEffect } from "react";
// import ReactDOM from 'react-dom';
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";

// import dotenv from  'dotenv'
import AddMeal from "./addmeal";
import Meal from "./displaymeal";
// import { isLogin } from "./utils/auth.js"

const AllMeals = (props) => {
    const [meals, setMeals] = useState([]);
    const [curr_user, setCurrUser] = useState(props.curr_user_id);
    const [mealsdisplay, setMealsdisplay] = useState(false);
    const [addmealdisplay, setAddmealdisplay] = useState(false);

    const url = "/meals/";
    useEffect(() => {
        // setCurrUser(props.curr_user_id);
        console.log(props);
        const token = localStorage.getItem("auth_token");
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json", auth_token: token },
            body: JSON.stringify(),
        };
        let first = process.env.REACT_APP_URL;
        console.log(curr_user);
        let second_arg = "meals/user/" + props.curr_user_id;
        let url = first + second_arg;
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if ("error" in data) {
                    console.log(data);
                } else {
                    console.log("Meals arrived",data);
                    setMeals(data);
                }
            });
    },[props.curr_user_id]);

    const toggleButton = () => {
        // console.log(1);
        setMealsdisplay((currentIsOpen) => !currentIsOpen);
        console.log(mealsdisplay);
        // this.setState((currentState) => ({
        //     mealsdisplay: !currentState.mealsdisplay,
        // }));
    };
    const toggleButtonaddmeal = () => {
        // console.log(2);
        setAddmealdisplay((currentIsOpen) => !currentIsOpen);
        // this.setState((currentState) => ({
        //     addmealdisplay: !currentState.addmealdisplay,
        // }));
    };
    const addMealToMealList = (data) => {
        // console.log(2);
        setMeals([...meals,data]);
    };
    return (
        <div className="form-control" style={{ height: "auto" }}>
            <div style={{ height: "auto" }}>
                <button
                    className="form-control btn btn-outline-primary"
                    onClick={() => toggleButton()}
                >
                    Meals
                </button>

                {mealsdisplay ? (
                    <DisplayAllMeals meals={meals} url={url} />
                ) : (
                    <div style={{ height: "auto" }}></div>
                )}
            </div>
            <div style={{ height: "auto" }}>
                <button
                    className="form-control btn btn-outline-primary"
                    onClick={() => toggleButtonaddmeal()}
                >
                    Add meal
                </button>

                {addmealdisplay ? (
                    <AddMeal hideandshow={toggleButtonaddmeal} addMealToMealList={addMealToMealList} />
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};

const DisplayAllMeals = (props) => {
    const meals = props.meals;
    const url = props.url;

    return (
        <div style={{ height: "auto" }}>
            {meals.map((meal) => (
                <div
                    className="form-control"
                    style={{ height: "100%", padding: "10px" }}
                    key={meal.meal_id}
                >
                    <Meal curr_list={{ meal, url }} />
                </div>
            ))}
        </div>
    );
};

export default AllMeals;
