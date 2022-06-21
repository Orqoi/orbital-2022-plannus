// The user controller controls and accesses the data

// We import the jsonwebtoken package to share security information between two parties — a client and a server in this case for login authentication purposes
const jwt = require('jsonwebtoken')

// We use bcrypt to safely store passwords by hashing
const bcrypt = require('bcryptjs')

// async handler is imported to handle exceptions inside of async express routes and passing them to your express error handlers.
const asyncHandler = require('express-async-handler')

// The user model which manages the name email password data of clients
const User = require('../models/userModel')

// @desc  Register User 
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user exists

    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hashing password

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user

    const user = await User.create({
        name,
        email, 
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc  Authenticate User
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            about: user.about,
            profileImage: user.profileImage,
            major: user.major,
            matriculationYear: user.matriculationYear,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// @desc  Get User data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    const {_id, name, email} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email,
    })
})

// @desc  Update User Details
// @route PUT /api/users/:id
// @access Public
const updateUser = asyncHandler(async (req, res) => {
    if (req.file) {
        console.log("changing image")
        const user = await User.findByIdAndUpdate(req.body.userId, {profileImage: req.file.filename}, {new: true})
        res.status(200).json(user)
    } else if (req.body.email) {
        console.log("changing email")
        const user = await User.findByIdAndUpdate(req.body.userId, {email: req.body.email}, {new: true})
        res.status(200).json(user)
    } else if (req.body.password) {
        console.log("changing password")
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = await User.findByIdAndUpdate(req.body.userId, {password: hashedPassword}, {new: true})
        res.status(200).json(user)
    } else if (req.body.gender) {
        console.log("changing gender")
        const user = await User.findByIdAndUpdate(req.body.userId, {gender: req.body.gender}, {new: true})
        res.status(200).json(user)
    } else if (req.body.about) {
        console.log("changing about")
        const user = await User.findByIdAndUpdate(req.body.userId, {about: req.body.about}, {new: true})
        res.status(200).json(user)
    } else if (req.body.major) {
        console.log("changing major")
        const user = await User.findByIdAndUpdate(req.body.userId, {major: req.body.major}, {new: true})
        res.status(200).json(user)
    } else if (req.body.matriculationYear) {
        console.log("changing matyear")
        const user = await User.findByIdAndUpdate(req.body.userId, {matriculationYear: req.body.matriculationYear}, {new: true})
        res.status(200).json(user)
    } else {
        res.status(400)
        throw new Error("Invalid request")
    }
})

// Generate JWT

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = {
    registerUser, 
    loginUser, 
    getMe,
    updateUser
}