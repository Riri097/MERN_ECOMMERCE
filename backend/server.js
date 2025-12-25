import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoute.js'; 
import { notFound, errorHandler } from './middleware/errorMiddleware.js'; // <--- ADD THIS LINE
import uploadRoutes from './routes/uploadRoutes.js'; 
import productRoutes from './routes/productRoutes.js'; 

dotenv.config();
connectDB();

const app = express();

app.use(cookieParser());
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));