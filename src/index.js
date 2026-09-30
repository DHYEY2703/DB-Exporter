const mysql = require('mysql2/promise');
const fs = require('fs').promises;

class DatabaseExporter {
    /**
     * @param {Object} dbConfig - MySQL connection configuration object
     */
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }

    /**
     * Exports a table to a JSON file.
     * @param {string} tableName - The name of the table to export.
     * @param {string} outputPath - The path to save the JSON file.
     * @returns {Promise<boolean>}
     */
    async exportToJson(tableName, outputPath) {
        let connection;
        try {
            // Connect to the database
            connection = await mysql.createConnection(this.dbConfig);
            
            // Fetch the data
            const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);
            
            // Write data to a JSON file
            await fs.writeFile(outputPath, JSON.stringify(rows, null, 2));
            
            console.log(`Successfully exported '${tableName}' to ${outputPath}`);
            return true;
        } catch (error) {
            console.error("Failed to export database:", error);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    /**
     * Exports the entire database schema to a SQL file (structure only, no data).
     * @param {string} outputPath - The path to save the .sql file.
     * @returns {Promise<boolean>}
     */
    async exportSchema(outputPath) {
        let connection;
        try {
            connection = await mysql.createConnection(this.dbConfig);
            
            // Get a list of all tables
            const [tablesResult] = await connection.execute('SHOW TABLES');
            const tables = tablesResult.map(row => Object.values(row)[0]);
            
            let schemaSql = `-- Database Schema Export\n\n`;

            for (const table of tables) {
                // Get the CREATE TABLE statement for each table
                const [createTableResult] = await connection.execute(`SHOW CREATE TABLE \`${table}\``);
                const createStatement = createTableResult[0]['Create Table'];
                
                schemaSql += `-- Structure for table: ${table}\n`;
                schemaSql += `${createStatement};\n\n`;
            }
            
            // Write to the .sql file
            await fs.writeFile(outputPath, schemaSql);
            
            console.log(`Successfully exported schema to ${outputPath}`);
            return true;
        } catch (error) {
            console.error("Failed to export schema:", error);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

// Export the class so others can use it
module.exports = DatabaseExporter;
