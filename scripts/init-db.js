const { createClient } = require('@libsql/client');
require('dotenv').config({ path: './.env.local' }); // Load environment variables from .env.local

async function init() {
  try {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      throw new Error('Turso database URL or auth token is not defined in .env.local');
    }

    const client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    await client.execute(`DROP TABLE IF EXISTS tickets;`);
    console.log('Existing tickets table dropped.');

    await client.execute(`
      CREATE TABLE tickets (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        item TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        usedAt TEXT
      );
    `);
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    // client.close(); // In a serverless environment, the client might not need explicit closing.
  }
}

init();
