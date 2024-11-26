import { Payment } from "@entities/Payment";

export interface IPaymentGateway {
	allPayments(): Promise<Payment[]>;

	getPaymentById(id: string): Promise<Payment>;

	getPaymentByMp(paymentCode: string): Promise<Payment>;
		
	getPaymentByOrderId(id:string): Promise<Payment>
	
	getPaymentFilter(filter: any): Promise<Payment[]>;

	newPayment(payment: Payment): Promise<Payment>;

	updatePayment(id: string, payment: Payment): Promise<void>;

	deletePayment(id: string): Promise<void>;
}
