import React, { useState, useEffect }  from "react";
// import ReactDOM from 'react-dom';
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    BrowserRouter as Router,
    useHistory,
    withRouter,
} from "react-router-dom";

const jwt = require("jsonwebtoken");

const NewLoginForm = (props) => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        };
        let first = process.env.REACT_APP_URL;
        let second_arg = "login";
        let url = first + second_arg;
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if ("error" in data) {
                    console.log(data["error"]);
                } else {
                    // let history = useHistory();
                    const token = data["jwt_token"];
                    const decoded = jwt.decode(token);
                    const current_user_id = decoded["user_id"];
                    // this.history.push("/dashboard");
                    localStorage.setItem("auth_token", token);
                    localStorage.setItem("user_id", current_user_id);
                    localStorage.setItem("loginTime", Date.now());
                    props.history.push("/dashboard");
                    props.checkLogin();
                }
            });
    }
    return (
        <form
            className="form-control "
            style={{ height: "auto", margin: "15px" }}
            onSubmit={handleSubmit}
        >
            <input
                className="form-control login-signup"
                type="text"
                name="username"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="form-control login-signup"
                type="text"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                className="form-control login-signup  btn-primary"
                type="submit"
                value="Submit"
            />
        </form>
    );
};


export default withRouter(NewLoginForm);
// export default LoginForm;
