import express from 'express';
import cors from 'cors';
import prizesRouter from './prizes.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(prizesRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});