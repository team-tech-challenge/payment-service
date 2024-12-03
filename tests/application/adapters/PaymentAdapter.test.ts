import { PaymentAdapter } from "@adapters/PaymentAdapter";
import PaymentModel from "@database/PaymentModel";
import { PaymentMapper } from "@mappers/PaymentMapper";
import { Payment } from "@entities/Payment";

// Mock do PaymentModel
jest.mock("@database/PaymentModel", () => ({
	find: jest.fn().mockResolvedValue([
		{ paymentMethod: "credit_card", paymentCode: "abc123", status: "paid", orderId: 1, mercadoPagoResponse: "response1", id: "1" },
		{ paymentMethod: "paypal", paymentCode: "def456", status: "pending", orderId: 2, mercadoPagoResponse: "response2", id: "2" },
	]),
	findOne: jest.fn().mockImplementation(() => ({
		exec: jest.fn().mockResolvedValue({
			paymentMethod: "credit_card",
			paymentCode: "abc123",
			status: "paid",
			orderId: 1,
			mercadoPagoResponse: "response1",
			id: "1",
		}),
	})),
	deleteOne: jest.fn().mockImplementation(() => ({
		exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
	})),
	create: jest.fn(),
	updateOne: jest.fn(),
}));

// Mock do PaymentMapper
jest.mock("@mappers/PaymentMapper");

describe("PaymentAdapter", () => {
	let paymentAdapter: PaymentAdapter;

	beforeEach(() => {
		paymentAdapter = new PaymentAdapter();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should fetch all payments", async () => {
		const mockPaymentModels = [
			{ paymentMethod: "credit_card", paymentCode: "abc123", status: "paid", orderId: 1, mercadoPagoResponse: "response1", id: "1" },
			{ paymentMethod: "paypal", paymentCode: "def456", status: "pending", orderId: 2, mercadoPagoResponse: "response2", id: "2" },
		];

		(PaymentMapper.toEntity as jest.Mock).mockImplementation((model) =>
			new Payment(model.paymentMethod, model.paymentCode, model.status, model.orderId, model.mercadoPagoResponse, model.id)
		);

		const payments = await paymentAdapter.allPayments();

		expect(PaymentModel.find).toHaveBeenCalled();
		expect(PaymentMapper.toEntity).toHaveBeenCalledTimes(mockPaymentModels.length);
		expect(payments).toEqual(
			mockPaymentModels.map(
				(model) => new Payment(model.paymentMethod, model.paymentCode, model.status, model.orderId, model.mercadoPagoResponse, model.id)
			)
		);
	});

	it("should fetch a payment by ID", async () => {
		const mockPaymentModel = {
			paymentMethod: "credit_card",
			paymentCode: "abc123",
			status: "paid",
			orderId: 1,
			mercadoPagoResponse: "response1",
			id: "1",
		};

		(PaymentMapper.toEntity as jest.Mock).mockImplementation((model) =>
			new Payment(model.paymentMethod, model.paymentCode, model.status, model.orderId, model.mercadoPagoResponse, model.id)
		);

		const payment = await paymentAdapter.getPaymentById("1");

		expect(PaymentModel.findOne).toHaveBeenCalledWith({ _id: "1" });
		expect(PaymentMapper.toEntity).toHaveBeenCalledWith(mockPaymentModel);
		expect(payment).toEqual(
			new Payment("credit_card", "abc123", "paid", 1, "response1", "1")
		);
	});

	it("should create a new payment", async () => {
		const mockValues = {
			paymentMethod: "credit_card",
			paymentCode: "abc123",
			status: "paid",
			orderId: 1,
			mercadoPagoResponse: "response1",
		};
		const mockPaymentModel = { ...mockValues, id: "1" };

		(PaymentModel.create as jest.Mock).mockResolvedValue(mockPaymentModel);

		(PaymentMapper.toEntity as jest.Mock).mockImplementation((model) =>
			new Payment(model.paymentMethod, model.paymentCode, model.status, model.orderId, model.mercadoPagoResponse, model.id)
		);

		const payment = await paymentAdapter.newPayment(mockValues);

		expect(PaymentModel.create).toHaveBeenCalledWith(mockValues);
		expect(PaymentMapper.toEntity).toHaveBeenCalledWith(mockPaymentModel);
		expect(payment).toEqual(
			new Payment("credit_card", "abc123", "paid", 1, "response1", "1")
		);
	});

	it("should update a payment", async () => {
		const mockData = new Payment("credit_card", "abc123", "pending", 1, "response1", "1");

		(PaymentMapper.toModel as jest.Mock).mockImplementation((data) => ({
			paymentMethod: data.paymentMethod,
			paymentCode: data.paymentCode,
			status: data.status,
			orderId: data.orderId,
			mercadoPagoResponse: data.mercadoPagoResponse,
		}));

		await paymentAdapter.updatePayment("1", mockData);

		expect(PaymentMapper.toModel).toHaveBeenCalledWith(mockData);
		expect(PaymentModel.updateOne).toHaveBeenCalledWith(
			{ _id: "1" },
			{ $set: { paymentMethod: "credit_card", paymentCode: "abc123", status: "pending", orderId: 1, mercadoPagoResponse: "response1" } }
		);
	});

	it("should delete a payment", async () => {
		await paymentAdapter.deletePayment("1");

		expect(PaymentModel.deleteOne).toHaveBeenCalledWith({ _id: "1" });
	});

	it("should throw an error if trying to delete a non-existent payment", async () => {
		(PaymentModel.deleteOne as jest.Mock).mockReturnValue({
			exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
		});

		await expect(paymentAdapter.deletePayment("1")).rejects.toThrow(
			"Payment not found or already deleted."
		);
	});
});
