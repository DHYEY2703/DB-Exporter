# Easy DB Export - User Guide 🚀 (v2.0)

Welcome to `easy-db-export`! This guide will walk you through exactly how to install this library and use it to instantly back up or migrate your databases.

## What does it do?
`easy-db-export` is a Node.js utility that automatically converts your live databases (MySQL, PostgreSQL, or MongoDB) into portable backup files. 

For **MySQL & PostgreSQL**, you can choose to export:
1. **The Full Database:** Copies the structure AND raw data to a `.sql` file.
2. **The Schema Only:** Copies just the structure to a `.sql` file.
3. **To JSON:** Copies the raw data to a `.json` file.

For **MongoDB** (NoSQL), you can export:
1. **To JSON:** Exports all collections and documents to a `.json` file.

---

## Step 1: Installation

Open your terminal, navigate to your Node.js project folder, and run:

```bash
npm install easy-db-export
```

*(You may also need to run `npm install pg` for Postgres, or `npm install mongodb` for Mongo)*

---

## Step 2: Setup

In your JavaScript file (e.g., `app.js`), import the library and initialize it. **Make sure to specify the `type`!**

```javascript
const DatabaseExporter = require('easy-db-export');

const exporter = new DatabaseExporter({
    type: 'postgres',          // Choose 'mysql', 'postgres', or 'mongodb'
    host: 'localhost',         
    user: 'root',              
    password: 'password123',   
    database: 'my_store_db'    
});
```
*(For MongoDB, you can also just pass `uri: 'mongodb://localhost:27017/my_store_db'`)*

---

## Step 3: Exporting the Database

### Option A: Export Everything to SQL (MySQL & Postgres Only)
```javascript
exporter.exportFullDbToSql('./full_backup.sql')
    .then(() => console.log("Success! Full database exported."));
```

### Option B: Export Schema Only (MySQL & Postgres Only)
```javascript
exporter.exportSchema('./schema_only.sql')
    .then(() => console.log("Success! Schema exported."));
```

### Option C: Export Data to JSON (Universal)
Works across all three databases.
```javascript
exporter.exportToJson('./data_dump.json')
    .then(() => console.log("Success! Data exported to JSON."));
```

Enjoy seamless database backups! 🎉
