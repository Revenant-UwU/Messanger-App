import { app } from './app.js';

const port = process.env.PORT || 3000;

import { pool } from './utils/db.js';

pool
  .query('SELECT current_database() AS database')
  .then(({ rows }) => {
    console.log('PostgreSQL conectado:', rows[0].database);
  })
  .catch((error) => {
    console.error('Error conectando con PostgreSQL:', error);
  });

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});