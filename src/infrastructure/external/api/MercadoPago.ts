import { config } from 'dotenv';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getFirstAndLastName } from '@utils/transformation';

config();

const MERCADOPAGO_API_BASE = 'https://api.mercadopago.com';


const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;


// Função para criar o pagamento no Mercado Pago
const createMercadoPago = async (id: number, price: number, customer: any) => {
    const idempotencyKey = uuidv4();
    
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey,
    };
        
    const { firstName, lastName } = getFirstAndLastName(customer.name);
    
    try {
        
        const paymentData = {
            transaction_amount: price,
            description: `Pedido: ${id}`,
            payment_method_id: "pix",
            external_reference: `${id}`,
            payer: {
            email: customer.email,
            identification: {
                type: "CPF",
                number: customer.cpf
            }
            },
            notification_url: `${process.env.WEBHOOK}/payment/webhook`,
            additional_info: {
            payer: {
                first_name: firstName,
                last_name: lastName
            }
            }
        };  
        
        const response = await axios.post(
            `${MERCADOPAGO_API_BASE}/v1/payments`,
            paymentData,
            { headers }
        );        
        
        return response.data;
    } catch (error) {
        console.error('Error creating Mercado Pago payment:', error.response?.data || error.message)
        throw error;
    }
};

// Função para buscar informações de pagamento no Mercado Pago
const searchMercadoPago = async (id: string) => {

    const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',        
    };


    try {
        const response = await axios.get(
            `${MERCADOPAGO_API_BASE}/v1/payments/search`,
            {
                headers,
                params: {
                    id: id.toString()
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error searching Mercado Pago payment:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export { createMercadoPago, searchMercadoPago };