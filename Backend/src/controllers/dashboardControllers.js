import Income from '../model/Income.js'
import Expense from '../model/Expense.js'

// get dashboard data
const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id

        // =========================
        // TOTAL INCOME
        // =========================
        const totalIncome = await Income.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ])

        // =========================
        // TOTAL EXPENSE
        // =========================
        const totalExpense = await Expense.aggregate([
            { $match: { userId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ])

        // =========================
        // LAST 30 DAYS INCOME
        // =========================
        const last30daysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 })

        const incomeLast30days = last30daysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        )

        // =========================
        // LAST 30 DAYS EXPENSE
        // =========================
        const last30daysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 })

        const expenseLast30days = last30daysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        )

        // =========================
        // LAST 5 TRANSACTIONS
        // =========================
        const incomes = await Income.find({ userId })
            .sort({ date: -1 })
            .limit(5)

        const expenses = await Expense.find({ userId })
            .sort({ date: -1 })
            .limit(5)

        const last5transactions = [
            ...incomes.map(txn => ({
                ...txn.toObject(),
                type: "income"
            })),
            ...expenses.map(txn => ({
                ...txn.toObject(),
                type: "expense"
            }))
        ].sort((a, b) => b.date - a.date)

        // =========================
        // RESPONSE
        // =========================
        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) -
                (totalExpense[0]?.total || 0),

            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,

            last30daysExpenses: {
                total: expenseLast30days,
                transactions: last30daysExpenseTransactions
            },

            last30daysIncomes: {
                total: incomeLast30days,
                transactions: last30daysIncomeTransactions
            },

            recentTransactions: last5transactions,
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({
            message: "Server Error",
            error: err.message
        })
    }
}

export default getDashboardData