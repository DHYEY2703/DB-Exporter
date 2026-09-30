const { Client } = require('pg');
const fs = require('fs').promises;

class PostgresAdapter {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
    }

    // Helper to format values for Postgres inserts
    formatValue(val) {
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return val;
        if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
        // Basic escaping: replace single quotes with two single quotes
        const escaped = String(val).replace(/'/g, "''");
        return `'${escaped}'`;
    }

    async getTables(client) {
        const query = `
            SELECT tablename 
            FROM pg_catalog.pg_tables 
            WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema';
        `;
        const res = await client.query(query);
        return res.rows.map(row => row.tablename);
    }

    async exportFullDbToSql(outputPath) {
        const client = new Client(this.dbConfig);
        try {
            await client.connect();
            const tables = await this.getTables(client);
            
            let sqlOutput = `-- Full PostgreSQL Database Export (Schema + Data)\n\n`;

            for (const table of tables) {
                // Get Schema (Basic)
                const colQuery = `
                    SELECT column_name, data_type, character_maximum_length 
                    FROM information_schema.columns 
                    WHERE table_name = '${table}';
                `;
                const colRes = await client.query(colQuery);
                
                sqlOutput += `-- -------------------------------------------\n`;
                sqlOutput += `-- Structure for table: ${table}\n`;
                sqlOutput += `-- -------------------------------------------\n`;
                sqlOutput += `DROP TABLE IF EXISTS "${table}";\n`;
                sqlOutput += `CREATE TABLE "${table}" (\n`;
                
                const colDefs = colRes.rows.map(col => {
                    let type = col.data_type;
                    if (col.character_maximum_length) {
                        type += `(${col.character_maximum_length})`;
                    }
                    return `  "${col.column_name}" ${type}`;
                });
                
                sqlOutput += colDefs.join(',\n') + '\n);\n\n';

                // Get Data
                const dataRes = await client.query(`SELECT * FROM "${table}"`);
                if (dataRes.rows.length > 0) {
                    sqlOutput += `-- Data for table: ${table}\n`;
                    for (const row of dataRes.rows) {
                        const values = Object.values(row).map(v => this.formatValue(v)).join(', ');
                        sqlOutput += `INSERT INTO "${table}" VALUES (${values});\n`;
                    }
                    sqlOutput += `\n`;
                }
            }
            
            await fs.writeFile(outputPath, sqlOutput);
            console.log(`Successfully exported full PostgreSQL database to ${outputPath}`);
            return true;
        } catch (error) {
            console.error("Failed to export PostgreSQL database:", error);
            throw error;
        } finally {
            await client.end();
        }
    }

    async exportSchema(outputPath) {
        const client = new Client(this.dbConfig);
        try {
            await client.connect();
            const tables = await this.getTables(client);
            
            let schemaSql = `-- PostgreSQL Database Schema Export\n\n`;

            for (const table of tables) {
                const colQuery = `
                    SELECT column_name, data_type, character_maximum_length 
                    FROM information_schema.columns 
                    WHERE table_name = '${table}';
                `;
                const colRes = await client.query(colQuery);
                
                schemaSql += `-- Structure for table: ${table}\n`;
                schemaSql += `DROP TABLE IF EXISTS "${table}";\n`;
                schemaSql += `CREATE TABLE "${table}" (\n`;
                
                const colDefs = colRes.rows.map(col => {
                    let type = col.data_type;
                    if (col.character_maximum_length) {
                        type += `(${col.character_maximum_length})`;
                    }
                    return `  "${col.column_name}" ${type}`;
                });
                
                schemaSql += colDefs.join(',\n') + '\n);\n\n';
            }
            
            await fs.writeFile(outputPath, schemaSql);
            console.log(`Successfully exported PostgreSQL schema to ${outputPath}`);
            return true;
        } catch (error) {
            console.error("Failed to export PostgreSQL schema:", error);
            throw error;
        } finally {
            await client.end();
        }
    }

    async exportToJson(outputPath) {
        const client = new Client(this.dbConfig);
        try {
            await client.connect();
            const tables = await this.getTables(client);
            
            const fullData = {};

            for (const table of tables) {
                const dataRes = await client.query(`SELECT * FROM "${table}"`);
                fullData[table] = dataRes.rows;
            }
            
            await fs.writeFile(outputPath, JSON.stringify(fullData, null, 2));
            console.log(`Successfully exported PostgreSQL database to ${outputPath}`);
            return true;
        } catch (error) {
            console.error("Failed to export PostgreSQL database to JSON:", error);
            throw error;
        } finally {
            await client.end();
        }
    }
}

module.exports = PostgresAdapter;
