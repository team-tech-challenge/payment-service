export class ProductError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ProductError';
    }
}

export class ProductNotFoundError extends ProductError {
    constructor(message: string) {
        super(message);
        this.name = 'ProductNotFoundError';
    }
}