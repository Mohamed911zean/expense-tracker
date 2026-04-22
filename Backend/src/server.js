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

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))



app.use(express.json())

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is running" });
});

connectDB()

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/income", incomeRoutes)
app.use("/api/v1/expense", expenseRoutes)
app.use("/api/v1/aqusetions", aqusetionsRoutes)
app.use("/api/v1/dashboard", dashboardRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, "0.0.0.0", () => console.log("server running on port:", PORT))