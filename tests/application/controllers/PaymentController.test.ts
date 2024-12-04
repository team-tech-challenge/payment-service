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

		expect(mockUseCase.getPaymentById).toHaveBeenCalledWith();
		expect(mockRes.json).toHaveBeenCalledWith(mockPayments);
	});

	it("should fetch a payment by ID", async () => {
		const mockPayment = new Payment("credit_card", "abc123", "success", 1, "response1", "1");

		mockUseCase.getPaymentById.mockResolvedValue(mockPayment);

		const mockReq = { params: { id: 1 } };
		await paymentController.getPaymentById(mockReq, mockRes);

		expect(mockUseCase.getPaymentById).toHaveBeenCalledWith(1);
		expect(mockRes.json).toHaveBeenCalledWith(mockPayment);
	});

	it("should return 404 if payment is not found", async () => {
		// Mock para simular que nenhum pagamento foi encontrado
		mockUseCase.getPaymentById.mockResolvedValue(null);
	
		const mockReq = { params: { id: 999 } }; // ID inexistente
		await paymentController.getPaymentById(mockReq, mockRes);
	
		expect(mockUseCase.getPaymentById).toHaveBeenCalledWith("999");
		expect(mockRes.status).toHaveBeenCalledWith(404);
		expect(mockRes.json).toHaveBeenCalledWith({ error: "Payment not found" });
	});

	it("should fetch a payment by code MP", async () => {
		const mockPayment = new Payment("credit_card", "abc123", "success", 1, "response1", "1");

		mockUseCase.getPaymentByMp.mockResolvedValue(mockPayment);

		const mockReq = { params: { paymentCode: 1 } };
		await paymentController.getPaymentByMp(mockReq, mockRes);

		expect(mockUseCase.getPaymentByMp).toHaveBeenCalledWith(1);
		expect(mockRes.json).toHaveBeenCalledWith(mockPayment);
	});

	it("should fetch a payment by orderId", async () => {
		const mockPayment = new Payment("credit_card", "abc123", "success", 1, "response1", "1");

		mockUseCase.getPaymentByOrderId.mockResolvedValue(mockPayment);

		const mockReq = { params: { Id: 1 } };
		await paymentController.getPaymentByOrderId(mockReq, mockRes);

		expect(mockUseCase.getPaymentByOrderId).toHaveBeenCalledWith(1);
		expect(mockRes.json).toHaveBeenCalledWith(mockPayment);
	});

	it('deve criar um novo pagamento com sucesso', async () => {
		const mockPayment = new Payment("credit_card", "abc123", "success", 1, "response1", "1");
		mockUseCase.createPayment.mockResolvedValue(mockPayment);

		const req = {
			body: { paymentMethod: mockPayment.getPaymentMethod(), paymentCode: mockPayment.getPaymentCode(), status: 'ToPay', orderId: mockPayment.getOrder(), mercadoPagoResponse: "response1" },
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await paymentController.createPayment(req, res);

		expect(mockUseCase.createPayment).toHaveBeenCalledWith();
		expect(defaultReturnStatement).toHaveBeenCalledWith(
			mockRes,
			"Payment Created",
			undefined
		);
	});

	it('deve atualiza um pagamento com sucesso', async () => {
		const mockPayment = new Payment("credit_card", "abc123", "success", 1, "response1", "1");
		mockUseCase.updatePayment.mockResolvedValue(mockPayment);

		const req = {
			params: { id: '1' },
			body: { paymentMethod: mockPayment.getPaymentMethod(), paymentCode: mockPayment.getPaymentCode(), status: 'ToPay', orderId: mockPayment.getOrder(), mercadoPagoResponse: "response1" },
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		await paymentController.updatePayment(req, res);

		expect(mockUseCase.updatePayment).toHaveBeenCalledWith();
		expect(defaultReturnStatement).toHaveBeenCalledWith(
			mockRes,
			"Payment and Order updated successfully",
			undefined
		);
	});

	it("should delete a payment", async () => {
		mockUseCase.deletePayment.mockResolvedValue(undefined);

		const mockReq = { params: { id: "1" } };
		await paymentController.deletePayment(mockReq, mockRes);

		expect(mockUseCase.deletePayment).toHaveBeenCalledWith();
		expect(defaultReturnStatement).toHaveBeenCalledWith(
			mockRes,
			"Payment deleted successfully",
			undefined
		);
	});

	it("should return 404 if payment is not found", async () => {

		mockUseCase.deletePayment.mockResolvedValue(undefined);

		const mockReq = { params: { id: 999 } };
		await paymentController.deletePayment(mockReq, mockRes);

		expect(mockUseCase.deletePayment).toHaveBeenCalledWith();
		expect(mockRes.json).toHaveBeenCalledWith({ error: "Payment not found" });		
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
		expect(mockUseCase.webhookPayment).toHaveBeenCalledWith();
		expect(defaultReturnStatement).toHaveBeenCalledWith(
			mockRes,
			"Webhook received successfully",
			""
		);
	});
});
