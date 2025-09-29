import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import UserRouter from './routers/user/userRoutes.js';
import AdminRoute from './routers/admin/adminRoutes.js';


dotenv.config();

const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: 'https://capstone-project-hana-park.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});


app.use(cors({
    origin: 'https://capstone-project-hana-park.vercel.app',
    credentials: true, 
}));

  io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  req.io = io;
  next();
});


app.use('/admin', AdminRoute);  
app.use('/', UserRouter);       


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});


