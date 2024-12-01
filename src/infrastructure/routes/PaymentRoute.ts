import { Router } from "express";
import { PaymentAdapter } from "@adapters/PaymentAdapter";
import { PaymentUseCase } from "@usecases/PaymentUseCase";
import { PaymentController } from "@controllers/PaymentController";

export const paymentRoute = Router();

const paymentAdapter = new PaymentAdapter();

const paymentUseCase = new PaymentUseCase(paymentAdapter);
const paymentController = new PaymentController(paymentUseCase);

paymentRoute.get("/all", (req, res) => {
	// #swagger.tags = ['Payment']
	/* #swagger.responses[200] = {
            description: 'Return all payments',
            schema: { $ref: '#/definitions/Payment' }
    } */
	paymentController.getAll(req, res);
});

paymentRoute.get("/:Id", (req, res) => {
	// #swagger.tags = ['Payment']
	paymentController.getPaymentById(req, res);
});

paymentRoute.get("/mp/:paymentCode", (req, res) => {
	// #swagger.tags = ['Payment']
	paymentController.getPaymentByMp(req, res);
});

paymentRoute.get("/order/:id", (req, res) => {
	// #swagger.tags = ['Payment']
	paymentController.getPaymentByOrderId(req, res);
});

paymentRoute.post("/create", (req, res) => {
	// #swagger.tags = ['Payment']
	/* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: '#/definitions/Payment' }
                }
            }
        }
    */
	paymentController.createPayment(req, res);
});

paymentRoute.post("/webhook", (req, res) => {
	// #swagger.tags = ['Payment']
	/* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: '#/definitions/webhookPayment' }
                }
            }
        }
    */
	paymentController.webhook(req, res);
});

paymentRoute.delete("/delete/:id", (req, res) => {
	// #swagger.tags = ['Payment']
	paymentController.deletePayment(req, res);
});

paymentRoute.put("/update/:id", (req, res) => {
	// #swagger.tags = ['FakeCheckout']
	/* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: '#/definitions/FakeCheckout' }
                }
            }
        }
    */
	paymentController.updatePayment(req, res);
});
