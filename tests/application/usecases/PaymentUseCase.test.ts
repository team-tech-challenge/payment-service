import { PaymentUseCase } from "@usecases/PaymentUseCase";
import { IPaymentGateway } from "@gateways/IPaymentGateway";
import { Payment } from "@entities/Payment";
import { createMercadoPago, searchMercadoPago } from "src/infrastructure/external/api/MercadoPago";
import { searchCustomer } from "src/infrastructure/external/api/Customer";
import { searchOrder, updateOrder } from "src/infrastructure/external/api/Order";

// Mocks
jest.mock("src/infrastructure/external/api/MercadoPago");
jest.mock("src/infrastructure/external/api/Customer");
jest.mock("src/infrastructure/external/api/Order");

describe("PaymentUseCase", () => {
	let paymentUseCase: PaymentUseCase;
	let mockPaymentGateway: jest.Mocked<IPaymentGateway>;

	beforeEach(() => {
		mockPaymentGateway = {
			allPayments: jest.fn(),
			getPaymentById: jest.fn(),
			getPaymentByMp: jest.fn(),
			getPaymentByOrderId: jest.fn(),
			newPayment: jest.fn(),
			updatePayment: jest.fn(),
			deletePayment: jest.fn(),
		} as unknown as jest.Mocked<IPaymentGateway>;

		paymentUseCase = new PaymentUseCase(mockPaymentGateway);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should create a new payment", async () => {
		const mockOrder = { id: 1, customerId: "customer1", price: 100, status: "pending" };
		const mockCustomer = { id: "customer1", name: "John Doe" };
		const mockPaymentMercadoPago = JSON.stringify({ id: "123", status: "approved" });
		const mockPayment = new Payment("credit_card", "123", "approved", 1, mockPaymentMercadoPago);
		jest.spyOn(mockPayment, 'getId').mockReturnValue("1"); // Configura explicitamente o ID

		(searchOrder as jest.Mock).mockResolvedValue(mockOrder);
		(searchCustomer as jest.Mock).mockResolvedValue(mockCustomer);
		(createMercadoPago as jest.Mock).mockResolvedValue(JSON.parse(mockPaymentMercadoPago));
		mockPaymentGateway.newPayment.mockResolvedValue(mockPayment);
		mockPaymentGateway.getPaymentById.mockResolvedValue(mockPayment);

		const result = await paymentUseCase.createPayment(
			new Payment("credit_card", "", "pending", 1)
		);

		expect(searchOrder).toHaveBeenCalledWith(1);
		expect(searchCustomer).toHaveBeenCalledWith("customer1");
		expect(createMercadoPago).toHaveBeenCalledWith(1, 100, mockCustomer);
		expect(mockPaymentGateway.newPayment).toHaveBeenCalledWith(expect.any(Payment));
		expect(mockPaymentGateway.getPaymentById).toHaveBeenCalledWith("1"); // Confirma a chamada com o ID correto.
		expect(result).toEqual(mockPayment);
	});
});
