import express from 'express'


import {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExcelExpense
} from '../controllers/expenseController.js'

import protect from '../middlewares/authMiddleware.js'

const router  = express.Router()

router.post('/add-expense' , protect, addExpense)
router.get('/get-all-expense' , protect , getAllExpense)
router.delete('/:id' , protect , deleteExpense)
router.get('/download-excel' , protect , downloadExcelExpense)

export default router