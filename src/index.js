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
}

// Export the class so others can use it
module.exports = DatabaseExporter;
