// import { PaymentUseCase } from '@usecases/PaymentUseCase';
// import { mockPayment } from './mocks/PaymentMock';
// import { mockMercadoPago } from './mocks/MercadoPagoMock';

// const mockPaymentGateway = {
//   newPayment: jest.fn().mockResolvedValue(mockPayment),
//   getPaymentById: jest.fn().mockResolvedValue(mockPayment),
// };

// describe('PaymentUseCase', () => {
//   let paymentUseCase: PaymentUseCase;

//   beforeEach(() => {
//     paymentUseCase = new PaymentUseCase(mockPaymentGateway, mockMercadoPago);
//   });

//   it('should create a new payment', async () => {
//     const paymentData = {
//       amount: 100,
//       description: 'Test Payment',
//       customerId: 'cust123',
//     };

//     const result = await paymentUseCase.createPayment(paymentData);

//     expect(result).toHaveProperty('id');
//     expect(mockMercadoPago.createPayment).toHaveBeenCalled();
//     expect(mockPaymentGateway.newPayment).toHaveBeenCalled();
//   });

//   it('should throw an error if payment not found', async () => {
//     mockPaymentGateway.getPaymentById.mockResolvedValueOnce(null);

//     await expect(paymentUseCase.getPaymentById('invalid-id')).rejects.toThrow('Payment not found');
//   });
// });


