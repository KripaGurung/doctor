import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectcloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import userRouter from './routes/userRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import khalti from "../backend/routes/khalti.js"



//app config
const app = express()
const port = process.env.PORT  || 4000
connectDB()
connectcloudinary()

//middlewares
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/admin',adminRouter)
// localhost:4000/api/admin/add-doctor
app.use('/api/user',userRouter)
app.use('/api/doctor',doctorRouter)
app.use("/khalti", khalti);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


//localhost:4000/api/user/adduser)
app.use('/uploads', express.static('uploads'));


app.get('/', (req,res)=>{       
    res.send('API WORKING ')
})

app.listen(port, ()=> console.log("Server Started", port))