import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from './app.js';
import { seedDatabase } from './seed.js';

const PORT = process.env.PORT || 5001;

async function start() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.log(`In-memory MongoDB started at ${uri}`);

  await mongoose.connect(uri);
  console.log('Connected to in-memory MongoDB');

  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);
