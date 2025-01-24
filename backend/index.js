import express from 'express';
import dotenv from 'dotenv';
import { ConnectDB } from './lib/Db.js';
import authroutes from './routes/auth.route.js'
dotenv.config();
const app = express();
app.use(express.json());





app.use('/api/auth',authroutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server Started At PORT ${process.env.PORT}`)
    ConnectDB();
})