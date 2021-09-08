const express = require('express');
const morgan = require('morgan');

const app = express();

app.use((req,res,next) => {
    console.log('Hello from middleware 😎');
    next();
})

exports.testMiddleware = (req,res,next) => {
    console.log('Hello from middleware 😎');
    next();
}
// manipulating data in request - adding a param
exports.requestTime = (req,res,next) => {
    req.requestTime = new Date().toISOString();
    next();
}
// using 3rd party - login middleware
exports.loginMiddleware = morgan('dev');
    
/*
MIDDLEWARE
    - order matters
    - will  be called for every single request

TYPES
    1. custom 
    2. 3rd party 
*/