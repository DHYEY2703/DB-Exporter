# DB-Exporter

A custom Node.js library to easily export MySQL databases (schema and data) to SQL files.

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

// 1. Export Full Database (Schema + Data) to SQL
exporter.exportFullDbToSql('./full_backup.sql')
    .then(() => console.log("Full DB export done!"))
    .catch(err => console.error(err));

// 2. Export Schema Only to SQL
exporter.exportSchema('./schema_backup.sql')
    .then(() => console.log("Schema export done!"))
    .catch(err => console.error(err));
```
