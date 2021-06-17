import React from 'react';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,

    Redirect
  } from "react-router-dom";



class AllUsers extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            };
    }
    componentDidMount(){
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json'
                         },
            body: JSON.stringify()
        };
        let first = process.env.REACT_APP_URL
        
        let second_arg = "users"
        let url = first + second_arg
        
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            if('error' in data){
                alert("Failed");
            }
            else{
                
                this.setState({ users: data })
            }
        })
    }
    loadUserDashboard(user_id){
    }
    render() {
        const url = "/users/"
        
        return (
            
            <div className="form-control" style={{height:"auto",margin:"15px"}}> 
                
                <h5>All users in the system</h5>
                {
                    
                    this.state.users.map((user) =>  
                        <div className="form-control" key={user.user_id}>
                        User name :
                        <IsCalsExdeeded curr_list={{user,url}}/>
                        </div>)
                }
            </div>
        );
      } 
}


function IsCalsExdeeded(props) {
    const user = props.curr_list.user

    
    const user_id = user['user_id']
    
    const isLoggedIn = props.curr_list.calories_exceeded;
    const url = props.curr_list.url
    return <a  href= {url + user.user_id} >{user.name} </a> ;
    
  }
export default AllUsers;
