const express = require('express');
const app = express();
const port = 5000;

// Middleware per consentire il CORS tra frontend e backend
const cors = require('cors');
app.use(cors());

// Configura la route per la richiesta /test
app.get('/test', (req, res) => {
  res.json({ message: 'Test request received successfully!' });
});

// Configura la route principale
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
