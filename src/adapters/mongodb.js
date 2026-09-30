const { MongoClient } = require('mongodb');
const fs = require('fs').promises;

class MongoAdapter {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
        
        // Construct MongoDB URI if not provided directly
        if (!this.dbConfig.uri) {
            const host = this.dbConfig.host || 'localhost';
            const port = this.dbConfig.port || 27017;
            const dbName = this.dbConfig.database || '';
            const credentials = this.dbConfig.user ? `${this.dbConfig.user}:${this.dbConfig.password}@` : '';
            this.uri = `mongodb://${credentials}${host}:${port}/${dbName}`;
            this.dbName = dbName;
        } else {
            this.uri = this.dbConfig.uri;
            this.dbName = this.dbConfig.database;
        }
    }

    async exportFullDbToSql(outputPath) {
        throw new Error("exportFullDbToSql is not supported for MongoDB (NoSQL). Please use exportToJson() instead.");
    }

    async exportSchema(outputPath) {
        throw new Error("exportSchema is not supported for MongoDB (NoSQL). Please use exportToJson() instead.");
    }

    async exportToJson(outputPath) {
        const client = new MongoClient(this.uri);
        try {
            await client.connect();
            const db = client.db(this.dbName);
            
            // Get all collections
            const collections = await db.listCollections().toArray();
            
            const fullData = {};

            for (const collInfo of collections) {
                const collectionName = collInfo.name;
                const collection = db.collection(collectionName);
                const docs = await collection.find({}).toArray();
                fullData[collectionName] = docs;
            }
            
            await fs.writeFile(outputPath, JSON.stringify(fullData, null, 2));
            console.log(`Successfully exported MongoDB database to ${outputPath}`);
            return true;
        } catch (error) {
            console.error("Failed to export MongoDB database:", error);
            throw error;
        } finally {
            await client.close();
        }
    }
}

module.exports = MongoAdapter;
