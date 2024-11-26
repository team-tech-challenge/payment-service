import { IPaymentGateway } from "@gateways/IPaymentGateway";
import PaymentModel from "@database/PaymentModel";
import { Payment } from "@entities/Payment";
import { PaymentMapper } from "@mappers/PaymentMapper";

export class PaymentAdapter implements IPaymentGateway {
	async allPayments(): Promise<Payment[]> {
		const paymentModels = await PaymentModel.find(); 
		return paymentModels.map(model => PaymentMapper.toEntity(model));		
	}

	async getPaymentById(id:string): Promise<Payment> {
        const paymentModel = await PaymentModel.findOne({_id:id}).exec();		
        return PaymentMapper.toEntity(paymentModel);	
    }
	
	async getPaymentByMp(paymentCode:string): Promise<Payment> {
        const paymentModel = await PaymentModel.findOne({ paymentCode: paymentCode}).exec();
        return PaymentMapper.toEntity(paymentModel);	
    }

	async getPaymentByOrderId(id:string): Promise<Payment> {
        const paymentModel = await PaymentModel.findOne({ orderId: id}).exec();
        return PaymentMapper.toEntity(paymentModel);	
    }

	async getPaymentFilter(filter: any): Promise<Payment[]> {
        const paymentDocuments  = await PaymentModel.find(filter).exec();
        return paymentDocuments.map(doc => PaymentMapper.toEntity(doc));
    }

	async newPayment(values: any): Promise<Payment> {
		const paymentModels = await PaymentModel.create(values);
        return PaymentMapper.toEntity(paymentModels);		
	}

	async updatePayment(id: string, data: Payment): Promise<void> {
		
		const updateData = PaymentMapper.toModel(data);
    	await PaymentModel.updateOne({ _id: id }, { $set: updateData });		
	}

	async deletePayment(id: string): Promise<void> {
		const deletedCount = await PaymentModel.deleteOne({ _id: id }).exec();

		if (deletedCount.deletedCount === 0) {
			throw new Error("Payment not found or already deleted.");
		}
	}
}
