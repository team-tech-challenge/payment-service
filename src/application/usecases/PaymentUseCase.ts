import { IPaymentGateway } from "@gateways/IPaymentGateway";
import { IOrderGateway } from "@gateways/IOrderGateway";
import { Payment } from "@entities/Payment";
import { ICustomerGateway } from "@gateways/ICustomerGateway";
import { createMercadoPago, searchMercadoPago } from "src/infrastructure/external/api/MercadoPago";

export class PaymentUseCase {
	constructor(
		private readonly paymentGateway: IPaymentGateway,
		private readonly orderGateway: IOrderGateway,
		private readonly customerGateway: ICustomerGateway
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

			//TROCAR PARA BUSCA NA API
			const order = await this.orderGateway.getOrderById(data.getOrder());
			if(!order) throw new Error('Order not found');
			//TROCAR PARA BUSCA NA API
			const customer = await this.customerGateway.getCustomerById(order.getCustomer());
			if(!customer) throw new Error('Customer not found');
			console.log(order.getId())
			const paymentMercadoPago = await createMercadoPago(order.getId(), order.getPrice(), customer);				
			const idPaymentMercadoPago = paymentMercadoPago.id;
			const statusPaymentMercadoPago= paymentMercadoPago.status
							
			const payment = new Payment(data.getPaymentMethod(), idPaymentMercadoPago.toString(), statusPaymentMercadoPago.toString(),order.getId(), paymentMercadoPago);
			
			const createPayment = await this.paymentGateway.newPayment(payment);
			
			//TROCAR PARA BUSCA NA API
			order.setStatus("Waiting Payment");
			await this.orderGateway.updateOrder(order.getId(), order);			
			

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
			
			const order = await this.orderGateway.getOrderById(existingPayment.getOrder());

			if (paymentStatus === 'approved') {
				order.setStatus("Processed");
				await this.orderGateway.updateOrder(order.getId(), order);
			} else if (paymentStatus === 'rejected') {		  
				order.setStatus("Cancelled");
				await this.orderGateway.updateOrder(order.getId(), order);
			}
			return "Payment and Order updated successfully";
		} catch (error) {
			console.error(`Error in webhookPayment: ${error.message}`);
			throw new Error(`Failed to process webhook payment: ${error.message}`);
		}
				
	}
	
}
