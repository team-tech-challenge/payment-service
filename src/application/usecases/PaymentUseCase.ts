import { IPaymentGateway } from "@gateways/IPaymentGateway";
import { Payment } from "@entities/Payment";
import { createMercadoPago, searchMercadoPago } from "src/infrastructure/external/api/MercadoPago";
import { searchCustomer } from "src/infrastructure/external/api/Customer";
import { searchOrder, updateOrder } from "src/infrastructure/external/api/Order";

export class PaymentUseCase {
	constructor(
		private readonly paymentGateway: IPaymentGateway
	) { }

	async getAll(): Promise<any> {
		return await this.paymentGateway.allPayments();
	}

	async getPaymentById(id: string): Promise<Payment | null> {
		const payment = await this.paymentGateway.getPaymentById(id);		
		if (!payment) {
            throw new Error("Payment not found");
        }

		return payment;
	}
	async getPaymentByMp(paymentCode: string): Promise<Payment | null> {
		
		const payment = await this.paymentGateway.getPaymentByMp(paymentCode);		
		if (!payment) {
            throw new Error("Payment not found");
        }
		
		return payment;
	}
	async getPaymentByOrderId(id: string): Promise<Payment | null> {
		
		const payment = await this.paymentGateway.getPaymentByOrderId(id);		
		if (!payment) {
            throw new Error("Payment not found");
        }
		
		return payment;
	}

	async createPayment(data: Payment): Promise<any> {

		try {
								
			const order = await searchOrder(data.getOrder())	
			if(!order) throw new Error('Order not found');
			
			const customer = await searchCustomer(order.customerId)			
			if(!customer) throw new Error('Customer not found');
			
			const paymentMercadoPago = await createMercadoPago(order.id, order.price, customer);				
			const idPaymentMercadoPago = paymentMercadoPago.id;
			const statusPaymentMercadoPago= paymentMercadoPago.status
					
			const payment = new Payment(data.getPaymentMethod(), idPaymentMercadoPago.toString(), statusPaymentMercadoPago.toString(), order.id, paymentMercadoPago);		
					
			const createPayment = await this.paymentGateway.newPayment(payment);
			
			
			order.status = "Waiting Payment";			
			await updateOrder(order.id, order);

			return this.getPaymentById(createPayment.getId());

		} catch (error) {
			console.error(`Error in create Payment: ${error.message}`);
			throw new Error("Failed to process create payment");
		}		
		
	}


	async updatePayment(id: string, data: Payment): Promise<any> {
		const existingPayment = await this.getPaymentById(id);
        if (!existingPayment) {
            throw new Error("Payment not found");
        }

		await this.paymentGateway.updatePayment(id, data);       

		return "Payment and Order updated successfully";
	}

	async deletePayment(id: string): Promise<void> {
		if (!id) throw new Error("Missing required parameter: id");
		try {
			await this.paymentGateway.deletePayment(id);
		} catch (error) {
			throw new Error(`Failed to delete payment: ${error.message}`);
		}
	}
	
	async webhookPayment(paymentCode: string): Promise<any> {

		try {
			// Busca o pagamento existente no banco de dados
			const existingPayment = await this.paymentGateway.getPaymentByMp(paymentCode);
			console.log("teste"+existingPayment)
			if (!existingPayment) {
				throw new Error("Payment record not found");
			}
			// Busca o pagamento no Mercado Pago usando a API
			const paymentDetails = await searchMercadoPago(existingPayment.getPaymentCode());			
			if (!paymentDetails || !paymentDetails.results || paymentDetails.results.length === 0) {
				throw new Error("No payment information returned from Mercado Pago");
			}
			
			const paymentStatus = paymentDetails.results[0]?.status;

			if (!paymentStatus ) {
				throw new Error("Payment not confirmed");
			}
			
			// Atualiza o status do pagamento
			existingPayment.setStatus(paymentStatus);
			existingPayment.setMercadoPagoResponse(paymentDetails.results[0])
			
			await this.paymentGateway.updatePayment(existingPayment.getId(), existingPayment);
		
			// Atualiza o status do pedido, se necessário
			
			const order = await searchOrder(existingPayment.getOrder());

			if (paymentStatus === 'approved') {
				order.setStatus("Processed");
				await updateOrder(order.id, order);
			} else if (paymentStatus === 'rejected') {		  
				order.setStatus("Cancelled");
				await updateOrder(order.id, order);
			}
			return "Payment and Order updated successfully";
		} catch (error) {
			console.error(`Error in webhookPayment: ${error.message}`);
			throw new Error(`Failed to process webhook payment: ${error.message}`);
		}
				
	}
	
}
