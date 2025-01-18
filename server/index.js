import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import customersRouter from './routes/customers.js';
import servicesRouter from './routes/services.js';
import productsRouter from './routes/products.js';
import appointmentsRouter from './routes/appointments.js';
import salesRouter from './routes/sales.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/products', productsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/sales', salesRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});