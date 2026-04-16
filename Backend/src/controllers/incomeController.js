import Income from "../model/Income.js";
import xlsx from 'xlsx'
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
        res.status(500).json({message : "error in adding income" , error : error.message})
    }
}

//get all income
const getAllIncome = async(req,res) => {
    const userId =  req.user._id

    try {
        const income = await Income.find({userId}).sort({date: -1})
        res.json(income)
    } catch (err) {
        res.status(500).json({message : "failed to get All Income"})
    }
}

const deleteIncome = async(req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id)
        res.json({message : "income deleted successfully"})
    } catch (error) {
        res.status(500).json({message : "failed to delete ," , error})
    }
}

const downloadExcelIncome = async(req, res) => {
    const userId = req.user._id

    try {
        const income = await Income.find({userId}).sort({date : -1}) 

        //prepare data for excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date: item.date
        }))

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(wb , ws , "Income")
        xlsx.writeFile(wb, "income_details.xlsx")
        res.download('income_details.xlsx')

    } catch (error) {
        res.status(500).json({message : "failed to download Income excel sheet"})
    }
}

export {addIncome , getAllIncome , deleteIncome , downloadExcelIncome}