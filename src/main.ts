import http from "http";
import newman from "@config/newman";
import express from "@config/express";

import { connectToMongoDB } from "@config/connectionFactory";

const server = new http.Server(express());
const port = Number(process.env.PORT);

async function startServer() {
	await connectToMongoDB();

	server.listen(port, () => {
		console.log(`Server running on ${port}`);
		newman();
	});
}

startServer();
