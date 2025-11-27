import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import accountsRouter from './routes/account.routes.js';
import quartersRouter from './routes/quarter.routes.js';
import movementsRouter from './routes/movement.routes.js';
import configRouter from './routes/config.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/accounts', accountsRouter);
app.use('/api/quarters', quartersRouter);
app.use('/api/movements', movementsRouter);
app.use('/api/config', configRouter);

// Default route
app.get('/', (req, res) => {
  res.send('Backend API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


/*// endpoints for CRUD accounts, movements, quarters, and import/export.
//const express = require('express');
import express from 'express'
import userRouter from './routes/user.js';

const app= express()

const PORT = 3000;
//route
app.get('/', (req,res)=>{
    res.send('express route')

})
app.use('/user', userRouter)
app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}...`)
})
                   
/*

let counter=0;

setImmediate(()=>{
    console.log(`setImmediate 1 from I/O callback, counter= ${++counter}`)
},0);


setTimeout(()=>{
    console.log(`setTimeout 1 from I/O callback, counter= ${++counter}`)
},0);

setInterval(()=>{
    console.log(`setInterval 1 from I/O callback, counter= ${++counter}`)
});



*/
