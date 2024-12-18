import { Payment } from "@entities/Payment";
import { PaymentUseCase } from "@usecases/PaymentUseCase";
import { defaultReturnStatement } from "@utils/http";
import { isValidNotification } from "@utils/valid";

export class PaymentController {
	constructor(private paymentUseCase: PaymentUseCase) { }

	async getAll(req, res) {
		try {
			const payments = await this.paymentUseCase.getAll();
			defaultReturnStatement(res, "Payments", payments);
		} catch (err) {
			res.status(500).json({ status: 500, error: err });
		}
	}

	async getPaymentById(req, res): Promise<void> {
        try {
            const { Id } = req.params;
            const payment = await this.paymentUseCase.getPaymentById(Id);
            if (payment) {
                res.status(200).json(payment);
            } else {
                res.status(404).json({ error: "Payment not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
	
	async getPaymentByOrderId(req, res): Promise<void> {
        try {		
			
            const { Id } = req.params;
            const payment = await this.paymentUseCase.getPaymentByOrderId(Id);
            if (payment) {
                res.json(payment);
            } else {
                res.status(404).json({ error: "Payment not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
	
	async getPaymentByMp(req, res): Promise<void> {
        try {
			

            const { paymentCode } = req.params;
			
            const payment = await this.paymentUseCase.getPaymentByMp(paymentCode);
            if (payment) {
                res.json(payment);
            } else {
                res.status(404).json({ error: "Payment not found" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

	async createPayment(req, res) {
		try {
			const {paymentMethod, paymentCode, status, orderId} = req.body			
			const paymentData = new Payment(paymentMethod, paymentCode, status, orderId)
			const payment = await this.paymentUseCase.createPayment(paymentData);
			defaultReturnStatement(res, "Payment Created", payment);
		} catch (err) {
			res.status(500).json({ status: 500, error: err });
		}
	}

	async updatePayment(req, res) {
		try {
			const result = await this.paymentUseCase.updatePayment(req.body, req.params.id);
			defaultReturnStatement(res, "Payment and Order updated successfully", result);
		} catch (err) {
			res.status(err.message === "Payment not executed" ? 404 : 500).json({ status: err.message === "Payment not executed" ? 404 : 500, error: err });
		}
	}

	async deletePayment(req, res) {
		try {
			const deletedCount = await this.paymentUseCase.deletePayment(req.params.id);
			const responseMessage = "Payment deleted successfully";
			defaultReturnStatement(res, responseMessage, deletedCount);
		} catch (err) {
			res.status(err.message === "Payment not found" ? 404 : 500).json({ status: err.message === "Payment not found" ? 404 : 500, error: err });
		}
	}

	async webhook(req, res) {		
		try {
			const secret = process.env.MERCADO_PAGO_SECRET; // Sua assinatura secreta do Mercado Pago
			const isValid = isValidNotification(req, secret);

			if (!isValid) {				
				return res.status(401).send('Unauthorized');
			}			
			const bodyMercadoPago = req.body;

		  if (bodyMercadoPago.type === 'payment') {			
			// Chama o use case para processar o pagamento
			await this.paymentUseCase.webhookPayment(bodyMercadoPago.data.id);
		  }
		  defaultReturnStatement(res, "Webhook received successfully","");
		} catch (error) {
		   res.status(400).send(error.message);
		}
	}
}import { Utils } from "sequelize";

