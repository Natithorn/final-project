import mongoose from "mongoose";

//เอามาจาก MongoDB ของตัวเอง
const uri = 
  "mongodb+srv://natithorns:1234@cluster1.us1op.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1";

let cachedDb: mongoose.Connection | null = null;

export async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const opts = { dbName: "Income-expense"};
  const conn = await mongoose.connect(uri, opts);
  cachedDb = conn.connection;
  return cachedDb;
} 
