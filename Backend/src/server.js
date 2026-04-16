import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import incomeRoutes from './routes/IncomeRoutes.js'
import expenseRoutes from './routes/ExpenseRoutes.js'
import aqusetionsRoutes from './routes/AqusetionsRoutes.js'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

connectDB()

app.use("/api/v1/auth" , authRoutes)
app.use("/api/v1/income" , incomeRoutes)
app.use("/api/v1/expense" , expenseRoutes)
app.use("/api/v1/aqusetions" , aqusetionsRoutes)


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("server running on port:", PORT))