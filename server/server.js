import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import bookRoutes from './routes/bookRoutes.js';
import morgan from 'morgan';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';
import setupElasticsearch from './utils/setupElasticsearch.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fixed path
const buildPath = path.join(__dirname, '../client/dist');

// Serve static files from the build directory
app.use('/',express.static(buildPath));

app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'));

// Routes
app.use('/api/books', bookRoutes);

app.get("/*", function (req, res) {
    console.log("user");
    res.sendFile( 
      path.join(__dirname, "../client/dist/index.html"),
      function (err) {
        if (err) {
          res.status(500).send("something wrong");
        }
      }
    );
  });

app.use(errorHandler);

connectDB();
setupElasticsearch();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
