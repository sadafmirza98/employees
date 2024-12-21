const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "employees",
  password: "admin",
  port: 5432,
});

module.exports = pool;

/* CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    email VARCHAR(255) NOT NULL UNIQUE,
    dob DATE,
    address TEXT,
    photo TEXT
); */
