import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import incomeRoutes from './routes/IncomeRoutes.js'
import expenseRoutes from './routes/ExpenseRoutes.js'
import aqusetionsRoutes from './routes/AqusetionsRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'

const app = express()

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json())
app.options("*", cors());

console.log("Origin:", origin);
connectDB()

app.use("/api/v1/auth" , authRoutes)
app.use("/api/v1/income" , incomeRoutes)
app.use("/api/v1/expense" , expenseRoutes)
app.use("/api/v1/aqusetions" , aqusetionsRoutes)
app.use("/api/v1/dashboard" , dashboardRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, "0.0.0.0", () => console.log("server running on port:", PORT))