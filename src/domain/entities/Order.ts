export class Order {
	private id?: number;
	private customerId: number;
	private status: string;
	private price: number;
	private campaignId?: number;
	private createdAt?: Date; // Defina como opcional
	private updatedAt?: Date; // Defina como opcional
	private timeElapsed?: string;
	

	constructor(customerId: number, status: string, price: number, campaignId?: number, id?: number) {
		this.customerId = customerId;
		this.status = status;
		this.price = price;
		this.campaignId = campaignId;
		this.id = id;
	}

	getId(): number | undefined {
		return this.id;
	}

	getStatus(): string {
		return this.status;
	}

	public setStatus(status: string): void {
		if (!status) {
			throw new Error("Name cannot be empty");
		}
		this.status = status;
	}

	getPrice(): number {
		return this.price;
	}

	public setPrice(price: string): void {
		if (!price) {
			throw new Error("Price cannot be empty");
		}
		this.status = status;
	}

	getCustomer(): number | undefined {
        return this.customerId;
    }

	getCampaign(): number | undefined {
        return this.campaignId;
    }

	// Métodos para manipular o preço
	addToTotalPrice(amount: number): void {
		this.price += amount;
	}

	applyCampaignDiscount(discountPercentage: number): void {
	this.price -= this.price * (discountPercentage / 100);
	}

	public getCreatedAt(): Date | undefined {
		return this.createdAt;
	}
	
	public getUpdatedAt(): Date | undefined {
		return this.updatedAt;
	}
	
	public getTimeElapsed(): string | undefined {
		return this.timeElapsed;
	}
	
	// Setter para timeElapsed
	public setTimeElapsed(timeElapsed: string): void {
		this.timeElapsed = timeElapsed;
	}
	
	// Métodos para definir createdAt e updatedAt caso sejam necessários
	public setCreatedAt(date: Date): void {
		this.createdAt = date;
	}
	
	public setUpdatedAt(date: Date): void {
		this.updatedAt = date;
	}
}
