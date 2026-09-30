# DB-Exporter

A custom Node.js library to easily export MySQL database tables to JSON files.

## Installation

You can install this locally into another project by referencing its folder, or by publishing it to GitHub/NPM.

```bash
npm install /path/to/DB-Exporter
```

## Usage

```javascript
const DatabaseExporter = require('easy-db-export');

const exporter = new DatabaseExporter({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'my_app_db'
});

// 1. Export Data to JSON
exporter.exportToJson('users', './users_backup.json')
    .then(() => console.log("Data export done!"))
    .catch(err => console.error(err));

// 2. Export Schema to SQL
exporter.exportSchema('./schema_backup.sql')
    .then(() => console.log("Schema export done!"))
    .catch(err => console.error(err));
```
