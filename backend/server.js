import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';

import { PrismaClient } from '@prisma/client';

//import routes
import userRouter from './routes/user.routes.js';
import accountsRouter from './routes/account.routes.js';
import quartersRouter from './routes/quarter.routes.js';
import movementsRouter from './routes/movement.routes.js';
// import configRouter from './routes/config.js';

// Import Middleware
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/quarters', quartersRouter);
app.use('/api/movements', movementsRouter);
// app.use('/api/config', configRouter);

// Default route
app.get('/', async (req, res) => {
    const userCount= await prisma.user.count();
    res.json(
        userCount == 0
        ? "No user have been added yet! "
        : "Some users have been added to the database!"
    );
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

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
