import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.resolve(process.cwd(), 'sqlite.db');
const db = new Database(dbPath);

// login user
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );
`);

// transaction
db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT,
      transaction_date TEXT,
      description TEXT,
      income REAL,
      expense REAL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

export default db;
