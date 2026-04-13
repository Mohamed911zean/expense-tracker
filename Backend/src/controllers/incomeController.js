import Income from "../model/Income.js";
import User from "../model/User.js";

//add income
const addIncome = async (req, res) => {
    const userId = req.user._id

    try {
        const {source , amount , date} = req.body

        if (!source || !amount || !date) {
            return res.status(400).json({message : "all field required"})
        }

        const NewIncome = await Income.create({
            userId,
            source,
            amount,
            date : new Date(date)
        })
        res.status(201).json({message : "income added" , NewIncome})
    } catch (error) {
        res.status(500).json({message : "error" , error : error.message})
    }
}

//get all income
const getAllIncome = async (req , res) => {
    try {
        const income = await Income.find({userId : req.user.id}).sort({date : -1})
        res.status(200).json(income)
    } catch (error) {
        res.status(500).json({message : "error" , error : error.message})
    }
}

//delete income
const deleteIncome = async (req , res) => {
    try {
        const income = await Income.findByIdAndDelete(req.params.id)
        res.status(200).json({message : "income deleted" , income})
    } catch (error) {
        res.status(500).json({message : "error" , error : error.message})
    }
}

//download excel
const downloadExcelIncome = async (req , res) => {
    try {
        const income = await Income.find({userId : req.user.id})
        res.status(200).json(income)
    } catch (error) {
        res.status(500).json({message : "error" , error : error.message})
    }
}

export {addIncome , getAllIncome , deleteIncome , downloadExcelIncome}