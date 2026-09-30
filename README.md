# DB-Exporter v2.0.0

A powerful Node.js library to easily export databases (MySQL, PostgreSQL, MongoDB) into portable backup files.

## Installation

```bash
npm install easy-db-export
```

*(Note: Ensure you have `mysql2`, `pg`, or `mongodb` installed depending on which database you are using).*

## Usage

```javascript
const DatabaseExporter = require('easy-db-export');

const exporter = new DatabaseExporter({
    type: 'postgres', // Options: 'mysql', 'postgres', 'mongodb'
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'my_app_db'
});

// 1. Export Full Database (Schema + Data) to SQL (MySQL & Postgres Only)
exporter.exportFullDbToSql('./full_backup.sql')
    .then(() => console.log("Full DB export done!"))
    .catch(err => console.error(err));

// 2. Export Schema Only to SQL (MySQL & Postgres Only)
exporter.exportSchema('./schema_backup.sql')
    .then(() => console.log("Schema export done!"))
    .catch(err => console.error(err));

// 3. Export to JSON (Universal: MySQL, Postgres, MongoDB)
exporter.exportToJson('./database_backup.json')
    .then(() => console.log("JSON export done!"))
    .catch(err => console.error(err));
```
