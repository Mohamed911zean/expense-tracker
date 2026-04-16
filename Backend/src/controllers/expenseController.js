import Expense from "../model/Expense.js";
import xlsx from 'xlsx'

const addExpense = async(req, res) => {
    const userId = req.user._id

    try {
        const {category , amount , date} = req.body

        if (!category || !amount || !date) {
            res.status(400).json({message : "all fields required"})
        }

        const newExpense = await Expense.create({
            userId,
            category,
            amount,
            date : new Date(date)
        })
        res.status(201).json({message : "Expense added Successfully" , newExpense})
    } catch (error) {
        res.status(500).json({message : "failed to add new expense"})
    }
}

const getAllExpense = async(req, res) => {
    const userId = req.user._id

    try {
        const expense = await Expense.find({userId}).sort({date : -1})
        res.json(expense)
    } catch (error) {
        res.status(500).json("failed to get all expenses")
    }
}

const deleteExpense = async(req, res) => {
    try {
    await Expense.findByIdAndDelete(req.params.id)
    res.json({message : "expense deleted successfully"})
    } catch (error) {
        res.status(500).json({message : "failed to delete Expense"})
    }
}

const downloadExcelExpense = async(req, res) => {
    const userId = req.user._id

    try {
        const expense = await Expense.find({userId}).sort({date : -1}) 

        //prepare data for excel
        const data = expense.map((item) => ({
            category: item.category,
            Amount: item.amount,
            Date: item.date
        }))

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(wb , ws , "Income")
        xlsx.writeFile(wb, "expense_details.xlsx")
        res.download('expense_details.xlsx')

    } catch (error) {
        res.status(500).json({message : "failed to download Expense excel sheet"})
    }
}

export {addExpense , getAllExpense , deleteExpense , downloadExcelExpense}