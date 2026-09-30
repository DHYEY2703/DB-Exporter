# DB-Exporter

A custom Node.js library to easily export MySQL database tables to JSON files.

## Installation

You can install this locally into another project by referencing its folder, or by publishing it to GitHub/NPM.

```bash
npm install /path/to/DB-Exporter
```

## Usage

```javascript
const DatabaseExporter = require('db-exporter');

const exporter = new DatabaseExporter({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'my_app_db'
});

// Run the export
exporter.exportToJson('users', './users_backup.json')
    .then(() => console.log("Done!"))
    .catch(err => console.error(err));
```
