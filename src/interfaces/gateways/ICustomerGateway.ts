export interface ICustomerGateway {
    getCustomerById(customerId: number): Promise<any | null>;
}