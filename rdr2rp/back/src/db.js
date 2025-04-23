const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost';
const dbName = 'rdrrp_db';

const client = new MongoClient(uri, { connectTimeoutMS: 5000 });

let db = null;

async function connectToDB() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log('[MONGODB] Connecté à la base ' + dbName);
  }
  return db;
}


module.exports = {
  connectToDB,
};