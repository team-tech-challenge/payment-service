import { config } from 'dotenv';
import axios from 'axios';

config();

const API_BASE = process.env.ORDER_SERVICE_URL || 'http://order-service:3000';


// Função para buscar informações de pagamento no Mercado Pago
const searchOrder = async (id: number) => {

    const headers = {        
        'Content-Type': 'application/json',        
    };

    try {
        const response = await axios.get(
            `${API_BASE}/order/${id}`,
            {
                headers                
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error searching Order in order:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const updateOrder = async (id: number, data:any) => {

      
    const headers = {        
        'Content-Type': 'application/json',        
    };

    try {
        const response = await axios.put(
            `${API_BASE}/order/update/${id}`,
            data,
            {
                headers                
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error searching Order in order:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export { searchOrder, updateOrder };