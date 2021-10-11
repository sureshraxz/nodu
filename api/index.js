const express = require('express');
const fs = require('fs');
const morgan = require( 'morgan' );
const { testMiddleware , requestTime , loginMiddleware } = require('./middle-ware')

const app = express();

//middle ware
app.use(express.json());
app.use(testMiddleware)
app.use(requestTime)
app.use(loginMiddleware)   

//require file
const tours = JSON.parse( fs.readFileSync(`${__dirname}/dev-data/tours-simple.json`) );

//start server
app.listen(3000, () =>{
    console.log(`App running on port 3000`);
})
/***********************    Approach 1  ******************************************** */
//------ Routes together -----

//-- old approach --

// // Get all tour details
// app.get('/api/v1/tours', getAllTours)

// // Get tour details with id - specify & read data from url parameters
// app.get('/api/v1/tours/:id', getTour)

// //create tour
// app.post('/api/v1/tours', createTour)

// //update tour
// app.patch('/api/v1/tours/:id', updateTour)

// //delete tour
// app.delete('/api/v1/tours/:id', deleteTour)

/**************************    Approach 2  ************************************************ */
/*----- Refactoring ------------
    1. keeping all route handler fns together
    2. keeping all routes together
*/
//------ Request Handler fns-----

const getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours
        }
    })
}

const getTour = (req, res) => {
    const id = req.params.id * 1;
    if( id > tours.length - 1){
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }
    //if found return particular details
    tour = tours.find(f => f.id === id)
    res.status(200).json({
        status: 'success',
        data:{
            tour
        } 
    })
}

const createTour = (req,res) => {
    /*    req.body - this contains our request 
        inorder to use this data in request we need request handler - middleware - express.json
    */
   console.log(req.params);
   console.log(req.body);
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
}

const updateTour = (req, res) => {
    
    const  id = req.params.id * 1;

    if( id > tours.length -1){
        return res.status(404).json({
            status:'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status:'success',
        data:{
            tour: 'updated successfully'
        }
    })
}

const deleteTour = (req, res) => {
    
    const  id = req.params.id * 1;

    if( id > tours.length -1){
        return res.status(404).json({
            status:'fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status:'success',
        data: null
    })
}

// app.get('/', (req,res) => {
//     res.send('connection tested successfully')
// })


// app.route('/api/v1/tours')
//     .get( getAllTours )
//     .post( createTour )

// app.route('/api/v1/tours/:id')
//     .get( getTour )
//     .patch( updateTour )
//     .delete( deleteTour )

/****************************    Approach 3  ********************************************** */
//--------Mounting the routers  ---------  

//1. creating tourRouter - similar to normal router 
// - useful when we need further divide the main app into sub apps based on resource (eg: tour , user ,...)
// i.e - 1 router per resource

const tourRouter = express.Router();    //router for a sub application

tourRouter
    .route('/')
    .get( getAllTours )
    .post( createTour  )

tourRouter
    .route('/:id')
    .get( getTour )
    .patch( updateTour )
    .delete( deleteTour )

//2. mapping route url to middleware router - mounting 
//whenerver request hits this url - '/api/v1/tours' - redirected to tourRouter middleware
// then this middleware  - will search in its routes section 
// based on the route found - respective route handler fn is implemented - reponse is sent 

app.use('/api/v1/tours', tourRouter);       //connecting the router to our main app


/************************************************************************** */



/* Note
1- we are using request handler
2- Response formating 
        - JSend 
            - send response as json
            - status field : success / failure
            - if its an array need to use - results field: with length of array as value
3. specify and read url parameters
    - if we specify n vars then our route should also be equal to n vars
        - /api/:id/:name (endpoint var)- /api/4/suresh  - success
        - /api/:id/:name - /api/4   - error (3:32) ---we can use optional param 
        - /api/:id/:name? - now name param is optional - /api/4 - success
    
JS        
1. json.parse - convert json to js object
2. json.stringify - convert js object to json 
3. Object.assign( target, source ) - will add and replace target object with source
4. convert numbers based string to number 
    id = '12' -> 12 --> id * 1

fs.readFile... ==> returns array
req.body ==> depends on user input (if json , txt, formdata)    
req.params ==> js object - {id :'5'} -> values are string

Status code 
200 - Ok
201 - created
204 - No content
404 - Not found

*/


