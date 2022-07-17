const path = require('path')
const express =  require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const port = process.env.PORT || 5200
const cors =  require('cors')

connectDB()

const app = express()
/*
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
*/

app.use(express.json())
app.use(express.urlencoded({ extended: false} ))

// Using user router in server
app.use('/api/users', require('./routes/userRoutes'))

app.use('/api/posts', require('./routes/postRoutes'))

app.use('/api/modules', require('./routes/moduleRoutes'))

app.use('/api/req', require('./routes/requirementRoutes'))

// Serve frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')))
} else {
    app.get('/', (req, res) => res.send('Please set to production'))
}

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))

