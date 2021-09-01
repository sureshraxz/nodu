const express = require('express');

const app = express();

//start up the server
app.listen(3000, () =>{
    console.log('App running on port 3000');
});

//route setup
//get method - can be tested in browser + postman - 127.0.0.1:3000/
app.get('/', (req,res) => {
    res.status(200).send('Hello from GET method')
})

//post method - can be tested in postman alone
app.post('/', (req,res) =>{
    res.json({message:'Hello from post method',method:'post'})
})
//.json - express automatically sets our content type - application/json
// we dont need to set content type manually as in node


/*
Notes:
1. express gives us more methods to handle simple tasks
    - json method
    - auomatic content type header...
 */