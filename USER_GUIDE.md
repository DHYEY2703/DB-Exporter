# Easy DB Export - User Guide 🚀

Welcome to `easy-db-export`! This guide will walk you through exactly how to install this library and use it to instantly back up or migrate your MySQL databases.

## What does it do?
`easy-db-export` is a Node.js utility that automatically converts your live MySQL database into a portable `.sql` file. You can choose to export:
1. **The Full Database:** Copies the structure (tables/columns) AND all the raw data (rows).
2. **The Schema Only:** Copies just the structure, leaving the tables completely empty.

You can take the generated `.sql` file and run it on any other MySQL server in the world to instantly recreate your database!

---

## Step 1: Installation

Open your terminal, navigate to your Node.js project folder, and run:

```bash
npm install easy-db-export
```

---

## Step 2: Setup

In your JavaScript file (e.g., `app.js` or `index.js`), import the library and initialize it with your database credentials.

```javascript
const DatabaseExporter = require('easy-db-export');

const exporter = new DatabaseExporter({
    host: 'localhost',         // Usually 'localhost' or an IP address
    user: 'root',              // Your MySQL username
    password: 'password123',   // Your MySQL password
    database: 'my_store_db'    // The name of the database you want to export
});
```

---

## Step 3: Exporting the Database

You have two powerful methods available to you. Both methods use Promises, so you can use `.then()` or `await`.

### Option A: Export Everything (Schema + Data)
Use this if you want a complete, 1:1 backup of your database, including all the information stored inside it.

```javascript
// This will create a file named "full_backup.sql" in your current folder
exporter.exportFullDbToSql('./full_backup.sql')
    .then(() => {
        console.log("Success! Full database exported.");
    })
    .catch((error) => {
        console.error("Oops, something went wrong:", error);
    });
```

### Option B: Export Schema Only (Structure)
Use this if you are setting up a testing environment or giving the database to another developer, and you want them to have the tables but **none of the private data**.

```javascript
// This will create a file named "schema_only.sql" in your current folder
exporter.exportSchema('./schema_only.sql')
    .then(() => {
        console.log("Success! Schema exported.");
    })
    .catch((error) => {
        console.error("Oops, something went wrong:", error);
    });
```

---

## Step 4: How to Import the `.sql` File
Once your `.sql` file is generated, how do you (or your team) actually use it?

**Using a Visual Tool (phpMyAdmin, DBeaver, MySQL Workbench):**
1. Create a new, empty database.
2. Click the **Import** or **Run SQL Script** button.
3. Select your `.sql` file and execute it. 

**Using the Terminal/Command Line:**
```bash
mysql -u your_username -p your_new_database < full_backup.sql
```

Enjoy seamless database backups! 🎉
