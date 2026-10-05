const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Extract credentials from MYSQL_URI or default to ranjith/ranjith64
const host = '127.0.0.1';
const port = 3306;
const user = 'root';
const password = 'ranjith64';
const database = 'belleaura';

async function setup() {
  try {
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`Database '${database}' created or already exists.`);
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error.message);
    process.exit(1);
  }
}

setup();
