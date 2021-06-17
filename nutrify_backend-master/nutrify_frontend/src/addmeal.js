import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, withRouter } from "react-router-dom";

const AddMeal = (props) => {
    const [foodname, setFoodname] = useState("");
    const [cals, setCals] = useState("");
    const [total_calories, setTotalCalories] = useState(0);

    const handleSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem("auth_token");
        console.log(foodname,cals)
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json", auth_token: token },
            body: JSON.stringify({
                food_name: foodname,
                calories: cals,
            }),
        };
        let first = process.env.REACT_APP_URL;
        let second_arg = "meals/";
        let url = first + second_arg;
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if ("error" in data) {
                    console.log(data);
                    // alert(data["error"]);
                }else{
                    props.addMealToMealList(data)
                }
            });
        props.hideandshow();
    };
    return (
        <form
            className="form-control"
            onSubmit={handleSubmit}
            style={{ height: "100%" }}
        >
            <input
                className="form-control"
                type="text"
                placeholder="Enter your food name"
                name="food_name"
                value={foodname}
                onChange={(e) => setFoodname(e.target.value)}
            />

            <input
                className="form-control"
                type="text"
                placeholder="Enter calories"
                name="calories"
                value={cals}
                onChange={(e) => setCals(e.target.value)}
            />
            <input
                className="form-control   btn-primary "
                type="submit"
                value="Submit"
            />
        </form>
    );
};

export default withRouter(AddMeal);
