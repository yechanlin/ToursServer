const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set('strictQuery', false);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down....');
  console.log(err.name, err.message);
  process.exit(1);
});

// Load environment variables
dotenv.config({ path: './config.env' });

// Get DB connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Connect to MongoDB first
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connection successful!');
    // Only require app after DB connection is established
    const app = require('./app');

    // Start server
    const port = process.env.PORT || 3001;
    const server = app.listen(port, () => {
      console.log(`App running on port ${port}...`);
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION! Shutting down....');
      console.log(err);
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
