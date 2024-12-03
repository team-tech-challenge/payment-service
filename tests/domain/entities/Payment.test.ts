import { Payment } from "@entities/Payment";

describe("Payment Entity", () => {
	it("should create a Payment instance with all fields", () => {
		const payment = new Payment(
			"credit_card",
			"abc123",
			"pending",
			1,
			"response123",
			"paymentId123"
		);

		expect(payment.getId()).toBe("paymentId123");
		expect(payment.getPaymentMethod()).toBe("credit_card");
		expect(payment.getPaymentCode()).toBe("abc123");
		expect(payment.getStatus()).toBe("pending");
		expect(payment.getOrder()).toBe(1);
		expect(payment.getMercadoPagoResponse()).toBe("response123");
	});

	it("should create a Payment instance with optional fields omitted", () => {
		const payment = new Payment("credit_card", "abc123", "pending", 1);

		expect(payment.getId()).toBeUndefined();
		expect(payment.getPaymentMethod()).toBe("credit_card");
		expect(payment.getPaymentCode()).toBe("abc123");
		expect(payment.getStatus()).toBe("pending");
		expect(payment.getOrder()).toBe(1);
		expect(payment.getMercadoPagoResponse()).toBeUndefined();
	});

	it("should update the payment status", () => {
		const payment = new Payment("credit_card", "abc123", "pending", 1);

		payment.setStatus("approved");
		expect(payment.getStatus()).toBe("approved");
	});

	it("should throw an error if setting an empty status", () => {
		const payment = new Payment("credit_card", "abc123", "pending", 1);

		expect(() => payment.setStatus("")).toThrow("Name cannot be empty");
	});

	it("should update the MercadoPago response", () => {
		const payment = new Payment("credit_card", "abc123", "pending", 1);

		payment.setMercadoPagoResponse("response456");
		expect(payment.getMercadoPagoResponse()).toBe("response456");
	});

	it("should return undefined for optional fields if not set", () => {
		const payment = new Payment("credit_card", "abc123", "pending", 1);

		expect(payment.getId()).toBeUndefined();
		expect(payment.getMercadoPagoResponse()).toBeUndefined();
	});
});
