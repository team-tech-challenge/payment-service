import { Order } from "@entities/Order";

export interface IOrderGateway {
    getOrderById(orderId: number): Promise<Order | null>;

    updateOrder(id: number, order: Order): Promise<Order | null>;
}