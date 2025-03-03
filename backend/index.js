import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { ConnectDB } from './lib/Db.js';
import authroutes from './routes/auth.route.js'
import messageroutes from './routes/message.route.js'
import cors from 'cors';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use('/api/auth',authroutes);
app.use('/api/message',messageroutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server Started At PORT ${process.env.PORT}`)
    ConnectDB();
})