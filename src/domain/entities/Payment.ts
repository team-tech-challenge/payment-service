export class Payment {
	private id?: string;
	private paymentMethod: string;	
	private paymentCode: string;	
	private status: string;
	private orderId: number;
	private mercadoPagoResponse?: string;	

	constructor(paymentMethod: string, paymentCode: string, status: string, orderId: number, mercadoPagoResponse?: string, id?: string) {
		this.id = id;
		this.paymentMethod = paymentMethod;		
		this.paymentCode = paymentCode;		
		this.status = status;
		this.orderId = orderId;
		this.mercadoPagoResponse = mercadoPagoResponse;
	}

	public getId(): string | undefined {
		return this.id;
	}

	public getPaymentMethod(): string {
		return this.paymentMethod;
	}
	public getPaymentCode(): string {
		return this.paymentCode;
	}
	
	public getStatus(): string {
		return this.status;
	}

	public setStatus(status: string): void {
		if (!status) {
			throw new Error("Name cannot be empty");
		}
		this.status = status;
	}

	public getOrder(): number {
        return this.orderId;
    }
	
	public setMercadoPagoResponse(mercadoPagoResponse: string): void {
		this.mercadoPagoResponse = mercadoPagoResponse;
	}

	public getMercadoPagoResponse(): string | undefined {
		return this.mercadoPagoResponse;
	}
   
}
