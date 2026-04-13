import express from 'express'


import {
    addIncome,
    getAllIncome,
    deleteIncome,
    downloadExcelIncome
} from '../controllers/incomeController.js'

import protect from '../middlewares/authMiddleware.js'

const router  = express.Router()

router.post('/add-income' , protect, addIncome)
router.get('/get-all-income' , protect , getAllIncome)
router.delete('/:id' , protect , deleteIncome)
router.get('/download-excel' , protect , downloadExcelIncome)

export default router