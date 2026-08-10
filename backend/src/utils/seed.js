import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Student } from '../models/Student.js';

dotenv.config();

const seedDatabase = async () => {
  console.log('Seed script disabled for production. Use scraper/scraper.py --all instead.');
  process.exit(0);
};

seedDatabase();
