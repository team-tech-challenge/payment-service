import swaggerAutogen from "swagger-autogen";
const swaggerBaseUrl = process.env.SWAGGER_BASE_URL || "http://localhost:3000";

const doc = {
	info: {
		version: "v1.0.0",
		title: "Swagger Tech Challenge",
		description: "Tech Challenge API",
	},
	servers: [
		{
			url: swaggerBaseUrl,
			description: "API Base URL",
		},
	],
	definitions: {
		Payment: {
			paymentMethod: "MercadoPago",
			paymentCode: "sdofjsiodj",
			status: "ToPay",
			orderId: 1,
		},
		webhookPayment: {
			id: "12345678",
			type: "payment",
		},
		FakeCheckout: {
			paymentMethod: "MercadoPago",
			paymentCode: "sdofjsiodj",
			status: "PAID",
			orderId: 1,
		},
	},
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/infrastructure/config/routes.ts"];
swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
