const express = require('express');
const path = require('path');

const app = express();

// Serve all static files from Angular build
app.use(express.static(path.join(__dirname, 'dist/gameshop')));

// SPA fallback: redirect all other routes to index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist/gameshop/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Frontend running on port ${PORT}`));
