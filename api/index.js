const express = require('express');
const fs = require('fs');

const app = express();

//middle ware
app.use(express.json());

//require file
const tours = JSON.parse( fs.readFileSync(`${__dirname}/dev-data/tours-simple.json`) );

//start server
app.listen(3000, () =>{
    console.log(`App running on port 3000`);
})

app.get('/', (req,res) => {
    res.send('connection tested successfully')
})

// Get tour details
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
})

//create tour
app.post('/api/v1/tours', (req,res) => {
    /*    req.body - this contains our request 
        inorder to use this data in request we need request handler - middleware - express.json
    */
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id : newId}, req.body );

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/tours-simple.json`, JSON.stringify(tours) , err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
})




/* Note
1. json.parse - convert json to js object
2. json.stringify - convert js object to json

    - we are using request handler
    - Response formating 
        - JSend 
            - send response as json
            - status field : success / failure
            - if its an array need to use - results field: with length of array as value
*/


