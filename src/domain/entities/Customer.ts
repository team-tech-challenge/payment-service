export class Customer {
	private id?: number;
	private cpf: string;
	private name: string;
	private phoneNumber: string;
	private email: string;

	constructor(cpf: string, name: string, phoneNumber: string, email: string,  id?: number) {
		this.cpf = cpf;
		this.name = name;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.id = id;
	}

	public getId(): number | undefined {
		return this.id;
	}

	public getCpf(): string {
		return this.cpf.replace(/\D/g, "");
	}

	public getName(): string {
		return this.name;
	}

	public getPhoneNumber(): string {
		return this.phoneNumber;
	}

	public getEmail(): string {
		return this.email;
	}

	// Método para retornar o primeiro e o último nome
	public getFirstAndLastName(): { firstName: string; lastName: string } {
		const nameParts = this.name.trim().split(/\s+/); // Divide o nome por espaços em branco
		const firstName = nameParts[0]; // Primeiro nome
		const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""; // Último nome ou vazio
	
		return {
		  firstName,
		  lastName,
		}
	}
}
