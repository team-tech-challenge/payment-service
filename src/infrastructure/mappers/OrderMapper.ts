import { Order } from "@entities/Order";

export class OrderMapper {
  // Mapeia de OrderModel (banco) para Order (domínio)
  static toEntity(orderModel: any): Order {
    const order =  new Order(
        orderModel.customerId,      
        orderModel.status,
        orderModel.price,
        orderModel.campaignId ? orderModel.campaignId : undefined,        
        orderModel.id,
    );

    order.setCreatedAt(orderModel.createdAt);
    order.setUpdatedAt(orderModel.updatedAt);

    return order;
  }
  // Mapeia de Order (domínio) para OrderModel (banco)
  static toModel(Order: Order): any {
    return {
        id: Order.getId(),
        status: Order.getStatus(),
        price: Order.getPrice(),
        customer: Order.getCustomer(),
        campaign: Order.getCampaign(),
    };
  }
}
