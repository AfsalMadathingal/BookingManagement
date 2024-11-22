import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import bookRoutes from './routes/bookRoutes.js';
import morgan from 'morgan';
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';
import setupElasticsearch from './utils/setupElasticsearch.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors())
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'));

// Routes
app.use('/api/books', bookRoutes);


app.use(errorHandler)

connectDB();
setupElasticsearch();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
