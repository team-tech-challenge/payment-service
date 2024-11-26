import { Customer } from "@entities/Customer";

export class CustomerMapper {
  // Mapeia de CustomerModel (banco) para Customer (domínio)
  static toEntity(customerModel: any): Customer {
    return new Customer(
        customerModel.cpf,
        customerModel.name,
        customerModel.phoneNumber,
        customerModel.email,
        customerModel.id
    );
  }
  // Mapeia de Customer (domínio) para CustomerModel (banco)
  static toModel(Customer: Customer): any {
    return {
        cpf: Customer.getCpf(),
        name: Customer.getName(),
        phoneNumber: Customer.getPhoneNumber(),
        email: Customer.getEmail(),
        id: Customer.getId(),
    };
  }
}