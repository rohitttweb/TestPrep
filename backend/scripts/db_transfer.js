// Script to transfer Sql table to mongodb

import { createConnection } from 'mysql2/promise';
import { Schema, model, connect, disconnect } from 'mongoose';

import  dotenv  from 'dotenv';
dotenv.config();

const mongoUri = process.env.MONGO_URI;


// Define the Question schema
const questionSchema = new Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true, validate: v => v.length === 4 },
    correct_ans: { type: String, required: true },
    maintopic: { type: String, required: true },
    subtopic: { type: String }
});

// Create the Question model
const Question = model('Question', questionSchema);

// SQL to MongoDB Migration Script
(async () => {
    // SQL Database Connection
    const sqlConnection = await createConnection({
        host: 'localhost', // Update with your SQL host
        user: 'root', // Update with your SQL username
        password: '', // Update with your SQL password
        database: 'onlinemocktestv1' // Update with your SQL database name
    });

    // MongoDB Connection
    await connect(mongoUri);

    console.log('Connected to SQL and MongoDB.');

    try {
        // Fetch data from SQL
        const [rows] = await sqlConnection.query('SELECT * FROM aptitude'); // Update with your SQL table name
        console.log(`Fetched ${rows.length} records from SQL.`);

        // Transform and Insert into MongoDB
        const transformedData = rows.map(row => ({
            question: row.question,
            options: [row.option1, row.option2, row.option3, row.option4],
            correct_ans: row.correct_ans,
            maintopic: "aptitude",
            subtopic: row.topic
        }));

        await Question.insertMany(transformedData);
        console.log(`Successfully migrated ${rows.length} records to MongoDB.`);
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        // Close connections
        await sqlConnection.end();
        await disconnect();
        console.log('Migration completed and connections closed.');
    }
})();
