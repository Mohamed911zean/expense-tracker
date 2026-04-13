import User from "../model/User.js";
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

//register user
const registerUser = async (req, res) => {
    const { fullName, email, password, profileImgUrl } = req.body

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        const user = await User.create({
            fullName,
            email,
            password,
            profileImgUrl
        })

        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id)
        })

    } catch (err) {
        res.status(500).json({ message: "Error", error: err.message })
    }
}

//login user
 const LoginUser = async (req , res) => {
    const {email , password} = req.body

    if (!email || !password) {
        return res.status(400).json({message : "All fields are required"})
    }

    try {
        const user = await User.findOne({email})
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({message : "invaild credentials"})
        }

        res.status(200).json({
            id : user._id,
            user,
            token : generateToken(user._id),
            message : "user logged in"
        })
    } catch (error) {
        res.status(500).json({message : "Error" , error : error.message})
    }
}

//get user info
const UserInfo = async(req, res) => {
    try {
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
        return res.status(404).json({message : "user not found"})
    }

    res.status(200).json(user)
} catch (err) {
    res.status(500).json({message : "Error" , error : err.message})
}
}

export  {registerUser , LoginUser , UserInfo}