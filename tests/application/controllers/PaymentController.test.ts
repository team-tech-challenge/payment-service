import { PaymentController } from "@controllers/PaymentController";
import { PaymentUseCase } from "@usecases/PaymentUseCase";
import { Payment } from "@entities/Payment";
import { defaultReturnStatement } from "@utils/http";
import { isValidNotification } from "@utils/valid";

// Mock das dependências
jest.mock("@usecases/PaymentUseCase");
jest.mock("@utils/http");
jest.mock("@utils/valid");

describe("PaymentController", () => {
	let paymentController: PaymentController;
	let mockUseCase: jest.Mocked<PaymentUseCase>;
	let mockRes: any;

	beforeEach(() => {
		// Mock da classe PaymentUseCase
		mockUseCase = {
			getAll: jest.fn(),
			getPaymentById: jest.fn(),
			getPaymentByMp: jest.fn(),
			getPaymentByOrderId: jest.fn(),
			createPayment: jest.fn(),
			updatePayment: jest.fn(),
			deletePayment: jest.fn(),
			webhookPayment: jest.fn(),
		} as unknown as jest.Mocked<PaymentUseCase>;

		paymentController = new PaymentController(mockUseCase);

		// Mock do objeto res
		mockRes = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis(),
		};
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should fetch all payments", async () => {
		const mockPayments = [
			new Payment("credit_card", "abc123", "success", 1, "response1", "1"),
			new Payment("paypal", "def456", "pending", 2, "response2", "2"),
		];

		mockUseCase.getAll.mockResolvedValue(mockPayments);

		const mockReq = {};
		await paymentController.getAll(mockReq, mockRes);

		expect(mockUseCase.getAll).toHaveBeenCalled();
		expect(defaultReturnStatement).toHaveBeenCalledWith(mockRes, "Payments", mockPayments);
	});

	it("should fetch a payment by ID", async () => {
		const mockPayment = new Payment("credit_card", "abc123", "success", 1, "response1", "1");

		mockUseCase.getPaymentById.mockResolvedValue(mockPayment);

		const mockReq = { params: { Id: "1" } };
		await paymentController.getPaymentById(mockReq, mockRes);

		expect(mockUseCase.getPaymentById).toHaveBeenCalledWith("1");
		expect(mockRes.json).toHaveBeenCalledWith(mockPayment);
	});

	it("should delete a payment", async () => {
		mockUseCase.deletePayment.mockResolvedValue(undefined);

		const mockReq = { params: { id: "1" } };
		await paymentController.deletePayment(mockReq, mockRes);

		expect(mockUseCase.deletePayment).toHaveBeenCalledWith("1");
		expect(defaultReturnStatement).toHaveBeenCalledWith(
			mockRes,
			"Payment deleted successfully",
			undefined
		);
	});

	it("should handle webhook notifications", async () => {
		const mockReq = {
			body: { type: "payment", data: { id: "1" } },
			headers: { "x-mercado-pago-signature": "valid-signature" },
		};

		(isValidNotification as jest.Mock).mockReturnValue(true);
		mockUseCase.webhookPayment.mockResolvedValue(undefined);

		await paymentController.webhook(mockReq, mockRes);

		expect(isValidNotification).toHaveBeenCalledWith(mockReq, process.env.MERCADO_PAGO_SECRET);
		expect(mockUseCase.webhookPayment).toHaveBeenCalledWith("1");
		expect(defaultReturnStatement).toHaveBeenCalledWith(
			mockRes,
			"Webhook received successfully",
			""
		);
	});
});
