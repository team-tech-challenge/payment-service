import { Payment } from '@entities/Payment';
import { PaymentDocument } from '@database/PaymentModel';

export class PaymentMapper {
  // Converte um documento do Mongoose em uma entidade de domínio
  static toEntity(payment: any): Payment {    
    return new Payment(
      payment.paymentMethod,
      payment.paymentCode,
      payment.status,
      payment.orderId,
      payment.mercadoPagoResponse,
      payment._id.toString()
    );
  }

  // Converte uma entidade de domínio em um objeto para o Mongoose
  static toModel(payment: Payment): Partial<PaymentDocument> {
    return {
      _id: payment.getId(),
      paymentMethod: payment.getPaymentMethod(),      
      paymentCode: payment.getPaymentCode(),      
      status: payment.getStatus(),
      orderId: payment.getOrder(),
      mercadoPagoResponse: payment.getMercadoPagoResponse(),
    };
  }
}