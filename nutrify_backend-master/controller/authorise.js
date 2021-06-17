var session = require('express-session')

app.use(session({ secret: 'keyboard cat', resave:false,saveUninitialized:false,cookie:{ maxAge: 60000 }}))


import jwt from 'jsonwebtoken';
const newSessionRoutes = [{ path: '/user/login', method: 'POST' }];
const authRoutes = [{ path: '/user/password', method: 'PUT' }];
const SECRET_KEY = "JWT_SECRET";