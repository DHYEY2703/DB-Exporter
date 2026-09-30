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
     * Exports the entire database (schema + data) to a SQL file.
     * @param {string} outputPath - The path to save the .sql file.
     * @returns {Promise<boolean>}
     */
    async exportFullDbToSql(outputPath) {
        let connection;
        try {
            connection = await mysql.createConnection(this.dbConfig);
            
            const [tablesResult] = await connection.execute('SHOW TABLES');
            const tables = tablesResult.map(row => Object.values(row)[0]);
            
            let sqlOutput = `-- Full Database Export (Schema + Data)\n\n`;

            for (const table of tables) {
                // Get Schema
                const [createTableResult] = await connection.execute(`SHOW CREATE TABLE \`${table}\``);
                const createStatement = createTableResult[0]['Create Table'];
                sqlOutput += `-- -------------------------------------------\n`;
                sqlOutput += `-- Structure for table: ${table}\n`;
                sqlOutput += `-- -------------------------------------------\n`;
                sqlOutput += `DROP TABLE IF EXISTS \`${table}\`;\n`;
                sqlOutput += `${createStatement};\n\n`;

                // Get Data
                const [rows] = await connection.execute(`SELECT * FROM \`${table}\``);
                if (rows.length > 0) {
                    sqlOutput += `-- Data for table: ${table}\n`;
                    for (const row of rows) {
                        const values = Object.values(row).map(val => connection.escape(val)).join(', ');
                        sqlOutput += `INSERT INTO \`${table}\` VALUES (${values});\n`;
                    }
                    sqlOutput += `\n`;
                }
            }
            
            await fs.writeFile(outputPath, sqlOutput);
            console.log(`Successfully exported full database to ${outputPath}`);
            return true;
        } catch (error) {
            console.error("Failed to export full database:", error);
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
