const MysqlAdapter = require('./adapters/mysql');
const PostgresAdapter = require('./adapters/postgres');
const MongoAdapter = require('./adapters/mongodb');

class DatabaseExporter {
    /**
     * @param {Object} dbConfig - Database connection configuration object
     */
    constructor(dbConfig) {
        this.type = dbConfig.type ? dbConfig.type.toLowerCase() : 'mysql'; // Default to mysql for backward compatibility
        
        switch(this.type) {
            case 'mysql':
                this.adapter = new MysqlAdapter(dbConfig);
                break;
            case 'postgres':
            case 'postgresql':
                this.adapter = new PostgresAdapter(dbConfig);
                break;
            case 'mongo':
            case 'mongodb':
                this.adapter = new MongoAdapter(dbConfig);
                break;
            default:
                throw new Error(`Unsupported database type: ${this.type}. Supported types: mysql, postgres, mongodb`);
        }
    }

    /**
     * Exports the entire database (schema + data) to a SQL file. (Not supported for Mongo)
     * @param {string} outputPath - The path to save the .sql file.
     * @returns {Promise<boolean>}
     */
    async exportFullDbToSql(outputPath) {
        return this.adapter.exportFullDbToSql(outputPath);
    }

    /**
     * Exports the entire database schema to a SQL file (structure only). (Not supported for Mongo)
     * @param {string} outputPath - The path to save the .sql file.
     * @returns {Promise<boolean>}
     */
    async exportSchema(outputPath) {
        return this.adapter.exportSchema(outputPath);
    }

    /**
     * Exports the entire database to a JSON file.
     * @param {string} outputPath - The path to save the .json file.
     * @returns {Promise<boolean>}
     */
    async exportToJson(outputPath) {
        if (!this.adapter.exportToJson) {
            throw new Error(`exportToJson is not implemented for the ${this.type} adapter yet.`);
        }
        return this.adapter.exportToJson(outputPath);
    }
}

// Export the class so others can use it
module.exports = DatabaseExporter;
