import express from 'express';
import cors from 'cors'
const app = express();
const PORT = 8000;
app.use(express.json());
app.use(cors());

app.post('/bmi', (req, res) => {
    const { weight, height } = req.body;
    console.log(weight,height)
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return res.json({ "bmi": bmi });
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});