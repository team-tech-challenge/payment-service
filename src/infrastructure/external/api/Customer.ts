import { config } from 'dotenv';
import axios from 'axios';

config();

const API_BASE = process.env.CUSTOMER_SERVICE_URL || 'http://users-service:3004';


// Função para buscar informações de pagamento no Mercado Pago
const searchCustomer = async (id: number) => {

    const headers = {        
        'Content-Type': 'application/json',        
    };

    try {
        const response = await axios.get(
            `${API_BASE}/customer/${id}`,
            {
                headers                
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error searching Customer in order:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export { searchCustomer };