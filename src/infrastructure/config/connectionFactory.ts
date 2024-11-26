import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectToMongoDB = async (): Promise<void> => {
	try {
		// const uri = `${process.env.MONGODB_HOST}://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@localhost:27017`;
		const uri = "mongodb://admin:secret@mongo:27017"
		console.log(uri)
		await mongoose.connect(uri, {
			autoIndex: false, // Desabilita criação automática de índices
			serverSelectionTimeoutMS: 10000, // Timeout de seleção de servidor
		  });
		console.log("Connected to MongoDB");
	} catch (error) {
	  console.error("Failed to connect to MongoDB", error);
	  process.exit(1);
	}
};