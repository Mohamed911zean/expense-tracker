import mongoose from 'mongoose'

import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
    {
        fullName : {type : String , required: true},
        email: {type : String, required : true},
        password : {type : String , required : true},
        profileImgUrl : {type : String , default : ''}
    },
    {timestamps : true}
)

//hash pass before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})

//compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword , this.password)
}

export default mongoose.model('User' , UserSchema)