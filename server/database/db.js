import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database in server directory
const dbPath = path.join(__dirname, '..', 'database.sqlite');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database.');
        this.initTables();
      }
    });
  }

  initTables() {
    // Create users table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create user_designs table for saving designs
    const createDesignsTable = `
      CREATE TABLE IF NOT EXISTS user_designs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        design_name VARCHAR(255) NOT NULL,
        design_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `;

    this.db.run(createUsersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
      } else {
        console.log('Users table created or already exists.');
      }
    });

    this.db.run(createDesignsTable, (err) => {
      if (err) {
        console.error('Error creating designs table:', err.message);
      } else {
        console.log('Designs table created or already exists.');
      }
    });
  }

  // User methods
  createUser(username, email, hashedPassword, callback) {
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    this.db.run(sql, [username, email, hashedPassword], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  getUserByEmail(email, callback) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    this.db.get(sql, [email], callback);
  }

  getUserById(id, callback) {
    const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
    this.db.get(sql, [id], callback);
  }

  // Design methods
  saveDesign(userId, designName, designData, callback) {
    const sql = 'INSERT INTO user_designs (user_id, design_name, design_data) VALUES (?, ?, ?)';
    this.db.run(sql, [userId, designName, JSON.stringify(designData)], function(err) {
      callback(err, this ? this.lastID : null);
    });
  }

  getUserDesigns(userId, callback) {
    const sql = 'SELECT * FROM user_designs WHERE user_id = ? ORDER BY created_at DESC';
    this.db.all(sql, [userId], callback);
  }

  deleteDesign(designId, userId, callback) {
    const sql = 'DELETE FROM user_designs WHERE id = ? AND user_id = ?';
    this.db.run(sql, [designId, userId], callback);
  }

  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}

export default new Database();
