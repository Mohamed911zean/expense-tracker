import mongoose from 'mongoose'

const aquestionSchema = new mongoose.Schema({
    UserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    name : {
        type : String,
        required : true
    },
    target : {
        type : Number,
        required : true
    },
    saved : {
        type : Number,
        required: true
    }
},  {timestamps : true}

)

export default mongoose.model("Aquestion" , aquestionSchema)