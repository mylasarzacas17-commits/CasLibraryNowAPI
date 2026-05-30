require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Connect to DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 CasLibraryNow API running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to database:', err.message);
  console.log('⚠️  Running without DB (in-memory mode)');
  app.listen(PORT, () => {
    console.log(`🚀 CasLibraryNow API running on port ${PORT}`);
  });
});
