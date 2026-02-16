const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'expense_tracker.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create expenses table
    // amount is stored in cents to avoid floating point errors
    db.run(`CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      amount INTEGER,
      category TEXT,
      description TEXT,
      date TEXT,
      created_at TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating expenses table', err.message);
      } else {
        console.log('Expenses table created or already exists.');
      }
    });

    // Create idempotency_log table
    db.run(`CREATE TABLE IF NOT EXISTS idempotency_log (
      key TEXT PRIMARY KEY,
      response_body TEXT,
      status_code INTEGER
    )`, (err) => {
      if (err) {
        console.error('Error creating idempotency_log table', err.message);
      } else {
        console.log('Idempotency log table created or already exists.');
      }
    });
  }
});

module.exports = db;
