import axios from "axios";
import { Customer } from "@entities/Customer";
import { ICustomerGateway } from "@gateways/ICustomerGateway";
import { CustomerMapper } from "@mappers/CustomerMapper";

export class CustomerAdapter implements ICustomerGateway {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.CUSTOMER_SERVICE_URL || "http://customer-service:3000/api/customers";
  }

  async getCustomerById(customerId: number): Promise<Customer | null> {
    const fakeCustomer = new Customer("08293336650","Pedro Freitas","31993350401","pedromcdefreitas@gmail.com",1);
   
	  return fakeCustomer;
    
    try {
      const response = await axios.get(`${this.baseUrl}/${customerId}`);
      return CustomerMapper.toEntity(response.data);
    } catch (error) {
      console.error("Error fetching customer:", error.message);
      return null;
    }
  }
}


















// import { Op } from "sequelize";

// import { Customer as CustomerModel } from "@database/CustomerModel";
// import { Customer } from "@entities/Customer";
// import { ICustomerGateway } from "@gateways/ICustomerGateway";
// import { CustomerMapper } from "@mappers/CustomerMapper";

// export class CustomerAdapter implements ICustomerGateway {
	
// 	async allCustomers(params?: any): Promise<Customer[]> {
		
// 		const customerModels = await CustomerModel.findAll(params); 
// 		return customerModels.map(model => CustomerMapper.toEntity(model));
// 	}
		
// 	async getCustomerById(id:number): Promise<Customer> {
//         const customerModel = await CustomerModel.findOne({ where: { id } });
//         return CustomerMapper.toEntity(customerModel);
//     }
	
	
// 	async newCustomer(customer: any): Promise<Customer> {
//         const customerModel = await CustomerModel.create(customer);
//         return CustomerMapper.toEntity(customerModel);
//     }
	
	
// 	async updateCustomer(id: number, data: Customer): Promise<void> {
		
//         const existingCustomer = await CustomerModel.findOne({ where: { id } });

//         if (!existingCustomer) {
//             throw new Error("Customer not found");
//         }

// 		try {
// 			await CustomerModel.update(data, {
// 				where: { id }
// 			});
// 		} catch (error) {
// 			console.error(error);
// 			throw new Error("Customer not updated");
// 		}
		
        
// 	}
	
	
// 	async deleteCustomer(id: number): Promise<number> {
//         const result = await CustomerModel.destroy({
//             where: { id }
//         });
//         return result;
//     }
	

// 	async newProductAssociation(products: CustomerProduct[]): Promise<void> {
// 		try {
// 			for (const customerProduct of products) {
// 				await CustomerProductModel.create({
// 					customerId: customerProduct.getCustomerId(),
// 					productId: customerProduct.getProductId(),
// 					comboId: customerProduct.getComboId(),			
// 					observation: customerProduct.getObservation(),
// 				});
// 			}
// 		} catch (error) {
// 			console.error(error);
// 			throw new Error("Product not association");
// 		}
		
// 	}
	
// 	async productsOfCustomer(customerId: number): Promise<{ product: Product; comboId: number | null }[]> {
// 		const customerProducts = await CustomerProductModel.findAll({
// 			where: { customerId },
// 			include: ['product'], // Inclui a relação do modelo do Produto
// 		});
		
// 		return customerProducts.map((customerProductRecord) => ({
// 			product: ProductMapper.toEntity(customerProductRecord.product),
// 			customerProduct: CustomerProductMapper.toEntity(customerProductRecord),
// 			comboId: customerProductRecord.comboId || null,
// 		}));
// 	}

// 	updateCustomerStatus(values: any, params: any): Promise<any> {
// 		return CustomerModel.update(values, params);
// 	}

// 	async updateCustomerTotalPrice(customerId: number, totalPrice: number): Promise<void> {
// 		await CustomerModel.update({ price:totalPrice }, { where: { id: customerId } });
// 	}

// 	async deleteProductOfCustomer(customerId: number, productId: number | null, comboId: number | null): Promise<void> {
// 		await CustomerProductModel.destroy({
// 			where: {
// 			  customerId,
// 			  productId: productId || null,
// 			  comboId: comboId || null
// 			},
// 		  });
// 	}
// }
