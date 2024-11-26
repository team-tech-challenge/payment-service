import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from 'uuid';

// Define a interface para tipagem do documento
export interface PaymentDocument extends Document {
  _id: string, // Geração de ID automático    
  paymentMethod: string; // Método de pagamento (PIX, cartão, etc.)  
  paymentCode: string; // Método de pagamento (PIX, cartão, etc.)  
  status: string; // Status do pagamento
  orderId: number; // Referência ao pedido
  mercadoPagoResponse?: any; // JSON completo retornado pelo Mercado Pago
  createdAt?: Date; // Data de criação
  updatedAt?: Date; // Data de atualização
}

// Definição do esquema do Mongoose
const PaymentSchema: Schema = new Schema(
  {
    _id: { 
      type: String, 
      default: () => uuidv4()
    },  
    
    paymentMethod: {
      type: String,
      required: true,
    },    
    paymentCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,      
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },   
    mercadoPagoResponse: {
      type: Schema.Types.Mixed, // Permite armazenar qualquer JSON
      default: null,
    },
  },
  {
    timestamps: true, // Cria os campos createdAt e updatedAt automaticamente
  }
);

// Criar o modelo do Mongoose
const PaymentModel = mongoose.model<PaymentDocument>("Payment", PaymentSchema);

export default PaymentModel;