import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend funcionando' });
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
