import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema({
    userId: {
            type : mongoose.Schema.Types.ObjectId,
            ref: "User",
            required : true
        },
    category: {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    date : {
        type : Date,
        default: Date.now,
        required : true
    }
} , {timestamps : true}
)

export default mongoose.model("Expense" , expenseSchema)