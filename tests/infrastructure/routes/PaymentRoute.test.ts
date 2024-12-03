import request from "supertest";
import express, { Express } from "express";
import { paymentRoute } from "@routes/PaymentRoute";
import { PaymentController } from "@controllers/PaymentController";

jest.mock("@controllers/PaymentController");

describe("Payment Routes", () => {
	let app: Express;
	let mockController: jest.Mocked<PaymentController>;

	beforeAll(() => {
		app = express();
		app.use(express.json());
		app.use("/payments", paymentRoute);

		mockController = {
			getAll: jest.fn().mockImplementation(async (req, res) =>
				res.status(200).json([{ id: "1", status: "success" }])
			),
			getPaymentById: jest.fn().mockImplementation(async (req, res) =>
				res.status(200).json({ id: "1", status: "success" })
			),
			getPaymentByMp: jest.fn().mockImplementation(async (req, res) =>
				res.status(200).json({ id: "1", paymentCode: "abc123", status: "success" })
			),
			getPaymentByOrderId: jest.fn().mockImplementation(async (req, res) =>
				res.status(200).json({ id: "1", orderId: "1", status: "success" })
			),
			createPayment: jest.fn().mockImplementation(async (req, res) =>
				res.status(201).json({ id: "1", status: "created" })
			),
			updatePayment: jest.fn().mockImplementation(async (req, res) =>
				res.status(200).json({ message: "Payment updated" })
			),
			deletePayment: jest.fn().mockImplementation(async (req, res) =>
				res.status(200).json({ message: "Payment deleted" })
			),
			webhook: jest.fn().mockImplementation(async (req, res) =>
				res.status(200).json({ message: "Webhook processed" })
			),
		} as unknown as jest.Mocked<PaymentController>;

		(PaymentController as jest.Mock).mockImplementation(() => mockController);
	});

	afterAll(() => {
		jest.resetAllMocks();
	});

	it("should fetch all payments", async () => {
		const response = await request(app).get("/payments/all");
		expect(mockController.getAll).toHaveBeenCalled();
		expect(response.status).toBe(200);
		expect(response.body).toEqual([{ id: "1", status: "success" }]);
	});

	it("should fetch a payment by ID", async () => {
		const response = await request(app).get("/payments/1");
		expect(mockController.getPaymentById).toHaveBeenCalled();
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ id: "1", status: "success" });
	});

	it("should create a new payment", async () => {
		const response = await request(app).post("/payments/create").send({
			paymentMethod: "credit_card",
			paymentCode: "abc123",
			status: "pending",
			orderId: 1,
		});
		expect(mockController.createPayment).toHaveBeenCalled();
		expect(response.status).toBe(201);
		expect(response.body).toEqual({ id: "1", status: "created" });
	});

	it("should handle payment webhook", async () => {
		const response = await request(app).post("/payments/webhook").send({
			type: "payment",
			data: { id: "1" },
		});
		expect(mockController.webhook).toHaveBeenCalled();
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: "Webhook processed" });
	});

	it("should delete a payment", async () => {
		const response = await request(app).delete("/payments/delete/1");
		expect(mockController.deletePayment).toHaveBeenCalled();
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: "Payment deleted" });
	});

	it("should update a payment", async () => {
		const response = await request(app).put("/payments/update/1").send({ status: "paid" });
		expect(mockController.updatePayment).toHaveBeenCalled();
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ message: "Payment updated" });
	});

	it("should fetch a payment by MercadoPago code", async () => {
		const response = await request(app).get("/payments/mp/abc123");
		expect(mockController.getPaymentByMp).toHaveBeenCalled();
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ id: "1", paymentCode: "abc123", status: "success" });
	});

	it("should fetch a payment by order ID", async () => {
		const response = await request(app).get("/payments/order/1");
		expect(mockController.getPaymentByOrderId).toHaveBeenCalled();
		expect(response.status).toBe(200);
		expect(response.body).toEqual({ id: "1", orderId: "1", status: "success" });
	});
});
