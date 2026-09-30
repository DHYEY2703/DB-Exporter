const mysql = require('mysql2/promise');
const fs = require('fs').promises;

class MysqlAdapter {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }

    async exportFullDbToSql(outputPath) {
        let connection;
        try {
            connection = await mysql.createConnection(this.dbConfig);
            
            const [tablesResult] = await connection.execute('SHOW TABLES');
            const tables = tablesResult.map(row => Object.values(row)[0]);
            
            let sqlOutput = `-- Full MySQL Database Export (Schema + Data)\n\n`;

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
            console.log(`Successfully exported full MySQL database to ${outputPath}`);
            return true;
        } catch (error) {
            console.error("Failed to export full MySQL database:", error);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async exportSchema(outputPath) {
        let connection;
        try {
            connection = await mysql.createConnection(this.dbConfig);
            
            const [tablesResult] = await connection.execute('SHOW TABLES');
            const tables = tablesResult.map(row => Object.values(row)[0]);
            
            let schemaSql = `-- MySQL Database Schema Export\n\n`;

            for (const table of tables) {
                const [createTableResult] = await connection.execute(`SHOW CREATE TABLE \`${table}\``);
                const createStatement = createTableResult[0]['Create Table'];
                schemaSql += `-- Structure for table: ${table}\n`;
                schemaSql += `${createStatement};\n\n`;
            }
            
            await fs.writeFile(outputPath, schemaSql);
            console.log(`Successfully exported MySQL schema to ${outputPath}`);
            return true;
        } catch (error) {
            console.error("Failed to export MySQL schema:", error);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }

    async exportToJson(outputPath) {
        let connection;
        try {
            connection = await mysql.createConnection(this.dbConfig);
            
            const [tablesResult] = await connection.execute('SHOW TABLES');
            const tables = tablesResult.map(row => Object.values(row)[0]);
            
            const fullData = {};

            for (const table of tables) {
                const [rows] = await connection.execute(`SELECT * FROM \`${table}\``);
                fullData[table] = rows;
            }
            
            await fs.writeFile(outputPath, JSON.stringify(fullData, null, 2));
            console.log(`Successfully exported MySQL database to ${outputPath}`);
            return true;
        } catch (error) {
            console.error("Failed to export MySQL database to JSON:", error);
            throw error;
        } finally {
            if (connection) {
                await connection.end();
            }
        }
    }
}

module.exports = MysqlAdapter;
