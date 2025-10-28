import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import UserRouter from './routers/user/userRoutes.js';
import AdminRoute from './routers/admin/adminRoutes.js';
import Reservation from './models/reservation.js';
import Slot from './models/slot.js';
import cron from 'node-cron';


dotenv.config();

const app = express();
const server = http.createServer(app); 

const allowedOrigins = [
  'https://hanapark.online',
  'https://www.hanapark.online',
  'http://localhost:5173',
  'https://hanapark.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

  io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on("joinUser", (userId) => {
    socket.join(userId); 
    console.log(`User ${userId} joined room`);
  });

  socket.on("joinAdmin", () => {
    socket.join("admins");
    console.log("An admin joined admin room");
  });

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

cron.schedule('* * * * *', async () => {
  console.log('Checking expired reservations...');

  try {
    const now = new Date();

    // Find pending reservations where reservation datetime has already passed
    const expiredReservations = await Reservation.find({
      status: 'Pending'
    });

    for (const res of expiredReservations) {
      // Combine reservationDate and reservationTime into a single Date
      const [hours, minutes] = res.reservationTime.split(':').map(Number);
      const resDateParts = res.reservationDate.split('-'); // adjust format if needed
      const reservationDateTime = new Date(res.reservationDate);
      reservationDateTime.setHours(hours, minutes, 0, 0);

      if (now > reservationDateTime) {
        // Cancel the reservation
        await Reservation.findByIdAndUpdate(res._id, { status: 'Cancelled' });

        // Make the slot available
        await Slot.findByIdAndUpdate(res.slotId, { slotStatus: 'Available' });

        console.log(`Reservation ${res._id} automatically cancelled.`);
        
        // Emit real-time update to user/admin
        req.io.to(res.reservedBy.toString()).emit('reservationCancelled', res._id);
        req.io.to("admins").emit('reservationCancelled', res._id);
      }
    }

  } catch (err) {
    console.error('Error checking expired reservations:', err);
  }
});


server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});


