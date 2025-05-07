import express from 'express'
import cors from 'cors';

import connectDB from './config/db.js'; // Import MongoDB connection
connectDB()
const port = 3001
const app = express()
/* const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from your frontend domain
    credentials: true,  // Allow cookies to be included in requests
}; */
app.use(
    cors({
      origin: "*", // Allow all origins (or specify allowed origins)
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    })
  );
app.use(express.json());
app.use(express.static('public'));

import AI_Route from './routes/AI_Route.js'
app.use('/api/ai', AI_Route);

import AuthRoute from './routes/AuthRoute.js';
app.use('/api/Auth', AuthRoute);

import userRoute from './routes/UserRoute.js';
app.use('/api/user', userRoute);

import GetQuestionRoute from './routes/GetQuestionsRoute.js'
app.use('/api/usertests', GetQuestionRoute);

import TestResultRoute from './routes/TestRoute.js'
app.use('/api/usertests', TestResultRoute);

import ORGRoute from './routes/ORGRoute.js'
app.use('/api/org', ORGRoute);


import statsRoutes  from './routes/stats.js';
app.use('/api/server', statsRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, '0.0.0.0', () => console.log(`Server running on port ${port}`));
