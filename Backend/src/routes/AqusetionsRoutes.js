import express from "express"

import {
    addAquestion,
    getAllAquestion,
    deleteAquestion
} from '../controllers/aqusetionsController.js'
import protect from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post('/add' , protect, addAquestion)
router.get('/get', protect, getAllAquestion)
router.delete('/:id' , protect, deleteAquestion)

export default router