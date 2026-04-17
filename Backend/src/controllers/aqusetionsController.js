import Aquestion from '../model/Aqusetions.js'

const addAquestion  = async(req , res) => {
    const userId = req.user._id

    try {
        const {name , target , saved} = req.body

        if (!name || !target || !saved) {
            res.status(400).json({message : "All fields required"})
        }

        const newAquestion = await Aquestion.create({
            userId,
            name,
            target,
            saved
        })

        res.status(201).json({message : "aquestion added succesfully", newAquestion})
    } catch (err) {
        res.status(500).json({message : "failed to add new aquestion", err})
    }
}

const getAllAquestion = async(req , res) => {
    const userId = req.user._id

    try {
        const aquestion = await Aquestion.find({userId}).sort({date: -1})
        res.json(aquestion)
    } catch (err) {
        res.status(500).json({message : "failed to fet aquestions" ,err})
    }
}

const deleteAquestion = async(req, res) => {
    try {
        await Aquestion.findByIdAndDelete(req.params.id)
        res.status(204).json({message : "aquestion deleted"})
    } catch (err) {
        res.status(500).json({message : "failed to delete aquestion"}, err)
    }
}

export {addAquestion , getAllAquestion , deleteAquestion}