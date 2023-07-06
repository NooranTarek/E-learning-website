import express from 'express'
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { dbConnection } from './database/dbConnection.js'
import adminRouter from './src/modules/admin/admin.router.js'
import * as dotenv from 'dotenv'
import studentRouter from './src/modules/student/student.router.js'
import teacherRouter from './src/modules/teacher/teacher.router.js'
import { photosRouter } from './src/modules/photos/photos.router.js'
import { videosRouter } from './src/modules/videos/videos.router.js'
import { pdfRouter } from './src/modules/PDFs/PDFs.router.js'
import LRF_Router from './src/modules/login_reset_forget/LRF.Router.js'
import { studentQuizRouter } from './src/modules/studentQuiz/quiz.router.js'
import { studentExamRouter } from './src/modules/studentExam/exam.router.js'
import studentReportRouter from './src/modules/studentReport/report.router.js'
import cors from "cors"
dotenv.config()
const app = express()
const port = 3000
app.use(express.json())
app.use(cors())
 //const http = require("http");
//const cors = require("cors");
const server = createServer(app); 
// const io =new Server (server)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use('/admin',adminRouter)
app.use('/student',studentRouter)
app.use('/teacher',teacherRouter)
app.use('/photos',photosRouter)
app.use('/videos',videosRouter)
app.use('/pdfs',pdfRouter)
app.use('/LRF',LRF_Router)
app.use('/quiz',studentQuizRouter)
app.use('/exam',studentExamRouter)
app.use('/report',studentReportRouter)

app.use('/photos',express.static('uploadPhotos'))
app.use(express.static('uploadVideos'))
app.use(express.static('uploadPdfs'))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/:room', (req,res) => {
    res.render('room',{roomId: req.params.room})
})
app.get('/',(req,res) =>{
    res.redirect(`/${uuidv4()}`)
})

app.use((error,req,res,next)=>{
    res.status(500).json(error)
})
dbConnection()

io.on('connection', socket => {
    socket.on('join-room', (userId) =>{
        socket.join(roomId)
        socket.to(roomId).emit('user-connected', userId)
        socket.on('disconnect', () =>{
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})

/////////////////////////////////////chat/////////////////////////////////////
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("join_room", (data) => {
      socket.join(data);
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });
  
    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
  
/////////////////////////////////////////////////////////////////////////////
server.listen(3000, () => {
  console.log("SERVER RUNNING");
});
// app.get('/', (req, res) => res.send('Hello World!'))
// app.listen(process.env.PORT ||port, () => console.log(`Example app listening on port ${port}!`))