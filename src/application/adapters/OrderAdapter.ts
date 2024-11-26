import axios from "axios";
import { Order } from "@entities/Order";
import { IOrderGateway } from "@gateways/IOrderGateway";
import { OrderMapper } from "@mappers/OrderMapper";

export class OrderAdapter implements IOrderGateway {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.ORDER_SERVICE_URL || "http://order-service:3000/api/orders";
  }

  async getOrderById(orderId: number): Promise<Order | null> {
	
	const fakeOrder = new Order(1,"Waiting Payment",1,0,orderId);
  
	  return Promise.resolve(fakeOrder);
	return;
    try {
      const response = await axios.get(`${this.baseUrl}/${orderId}`);
      return OrderMapper.toEntity(response.data);
    } catch (error) {
      console.error("Error fetching order:", error.message);
      return null;
    }
  }

  async updateOrder(orderId: number, updatedOrder: Order): Promise<Order | null> {
	return;
    try {
      const updatedData = OrderMapper.toModel(updatedOrder);
      const response = await axios.put(`${this.baseUrl}/${orderId}`, updatedData);

      return OrderMapper.toEntity(response.data);
    } catch (error) {
      console.error("Error updating order:", error.message);
      return null;
    }
  }
}


















// import { Op } from "sequelize";

// import { Order as OrderModel } from "@database/OrderModel";
// import { Order } from "@entities/Order";
// import { IOrderGateway } from "@gateways/IOrderGateway";
// import { OrderMapper } from "@mappers/OrderMapper";

// export class OrderAdapter implements IOrderGateway {
	
// 	async allOrders(params?: any): Promise<Order[]> {
		
// 		const orderModels = await OrderModel.findAll(params); 
// 		return orderModels.map(model => OrderMapper.toEntity(model));
// 	}
		
// 	async getOrderById(id:number): Promise<Order> {
//         const orderModel = await OrderModel.findOne({ where: { id } });
//         return OrderMapper.toEntity(orderModel);
//     }
	
	
// 	async newOrder(order: any): Promise<Order> {
//         const orderModel = await OrderModel.create(order);
//         return OrderMapper.toEntity(orderModel);
//     }
	
	
// 	async updateOrder(id: number, data: Order): Promise<void> {
		
//         const existingCustomer = await OrderModel.findOne({ where: { id } });

//         if (!existingCustomer) {
//             throw new Error("Order not found");
//         }

// 		try {
// 			await OrderModel.update(data, {
// 				where: { id }
// 			});
// 		} catch (error) {
// 			console.error(error);
// 			throw new Error("Order not updated");
// 		}
		
        
// 	}
	
	
// 	async deleteOrder(id: number): Promise<number> {
//         const result = await OrderModel.destroy({
//             where: { id }
//         });
//         return result;
//     }
	

// 	async newProductAssociation(products: OrderProduct[]): Promise<void> {
// 		try {
// 			for (const orderProduct of products) {
// 				await OrderProductModel.create({
// 					orderId: orderProduct.getOrderId(),
// 					productId: orderProduct.getProductId(),
// 					comboId: orderProduct.getComboId(),			
// 					observation: orderProduct.getObservation(),
// 				});
// 			}
// 		} catch (error) {
// 			console.error(error);
// 			throw new Error("Product not association");
// 		}
		
// 	}
	
// 	async productsOfOrder(orderId: number): Promise<{ product: Product; comboId: number | null }[]> {
// 		const orderProducts = await OrderProductModel.findAll({
// 			where: { orderId },
// 			include: ['product'], // Inclui a relação do modelo do Produto
// 		});
		
// 		return orderProducts.map((orderProductRecord) => ({
// 			product: ProductMapper.toEntity(orderProductRecord.product),
// 			orderProduct: OrderProductMapper.toEntity(orderProductRecord),
// 			comboId: orderProductRecord.comboId || null,
// 		}));
// 	}

// 	updateOrderStatus(values: any, params: any): Promise<any> {
// 		return OrderModel.update(values, params);
// 	}

// 	async updateOrderTotalPrice(orderId: number, totalPrice: number): Promise<void> {
// 		await OrderModel.update({ price:totalPrice }, { where: { id: orderId } });
// 	}

// 	async deleteProductOfOrder(orderId: number, productId: number | null, comboId: number | null): Promise<void> {
// 		await OrderProductModel.destroy({
// 			where: {
// 			  orderId,
// 			  productId: productId || null,
// 			  comboId: comboId || null
// 			},
// 		  });
// 	}
// }
