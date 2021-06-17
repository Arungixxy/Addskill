import React, { useState, useEffect } from "react";

import ReactDOM from "react-dom";
import "./index.css";
import NewRegisterForm from "./registerForm";
import NewLoginForm from "./loginForm";
import AllUsers from "./allUsers";
import UserCard from "./userCard";
import AddMeal from "./addmeal";

import { BrowserRouter as Router, Switch, Route, Link,Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { isLoggedIn, logOut } from "./utils/auth.js";

const jwt = require("jsonwebtoken");

const ImporvedHomePage = (props) => {
    const [loggedIn, setloggedIn] = useState(isLoggedIn());
    // const [showSignUp,setShowSignUp] = useState(false);
    useEffect(() => {
        setloggedIn(isLoggedIn());
    }, [loggedIn]);
    const checkLogin = () => {
        setloggedIn(isLoggedIn());
    };
    const toggleLogout = () => {
        console.log("Reached");
        logOut();
        setloggedIn(false);
    };

    return (
        <Router>
            <div>
                <div>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <a className="navbar-brand" href="/dashboard">
                            Nutrify
                        </a>
                        <div>
                            {loggedIn ? (
                                <LogoutKit toggleLogout={toggleLogout} />
                            ) : (
                                <div></div>
                            )}
                        </div>
                    </nav>
                </div>

                <div className="container">
                    {!loggedIn ? (
                        <LoginButtons checkLogin={checkLogin} />
                    ) : (
                        <div></div>
                    )}

                    <div className="row ">
                        <Switch>
                            <Route path="/login">
                                <NewLoginForm />
                            </Route>

                            <Route path="/signup">
                                <NewRegisterForm />
                            </Route>

                            {/* <Route path="/dashboard" component={AllUsers} /> */}
                            <PrivateRoute
                                path="/dashboard"
                                checkLogin={checkLogin}
                                component={AllUsers}
                            />
                            <PrivateRoute
                                path="/users/:user_id"
                                checkLogin={checkLogin}
                                component={UserCard}
                            />
                            {/* <Route
                                path="/users/:user_id"
                                component={UserCard}
                            /> */}
                            <Route path="/meals/add" component={AddMeal} />
                        </Switch>
                    </div>
                </div>

                {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            </div>
        </Router>
    );
};
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            isLoggedIn() ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: "/" }} />
            )
        }
    />
);
const LoginButtons = (props) => {
    const [showSignUp, setSignUp] = useState(true);

    const toggleSignUp = () => {
        if (showSignUp == true) {
            setSignUp(false);
        } else {
            setSignUp(true);
        }
    };

    return (
        <div>
            <div className="row ">
                <div className="col ">
                    {showSignUp ? (
                        <button
                            className="form-control btn btn-outline-primary"
                            onClick={toggleSignUp}
                            disabled
                        >
                            Signup
                        </button>
                    ) : (
                        <button
                            className="form-control btn btn-outline-primary"
                            onClick={toggleSignUp}
                        >
                            Signup
                        </button>
                    )}
                </div>
                <div className="col">
                    {showSignUp ? (
                        <button
                            className="form-control btn btn-outline-primary"
                            onClick={toggleSignUp}
                        >
                            Login
                        </button>
                    ) : (
                        <button
                            className="form-control btn btn-outline-primary"
                            onClick={toggleSignUp}
                            disabled
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
            {showSignUp ? (
                <NewRegisterForm toggleSignUp={toggleSignUp} />
            ) : (
                <NewLoginForm
                    toggleSignUp={toggleSignUp}
                    checkLogin={props.checkLogin}
                />
            )}
        </div>
    );
};
const LogoutKit = (props) => {
    return (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="form-inline my-2 my-lg-0">
                <div>
                    <button
                        className="form-control btn btn-outline-primary"
                        onClick={props.toggleLogout}
                    >
                        Logout{" "}
                    </button>
                </div>
            </form>
        </div>
    );
};

// ========================================

ReactDOM.render(<ImporvedHomePage />, document.getElementById("root"));
