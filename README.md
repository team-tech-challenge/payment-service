# Tech Challenge - FIAP 2024

### Descrição

Este projeto é uma aplicação Node.js estruturada com TypeScript e seguindo a arquitetura hexagonal. Utilizamos Express para criar a API, Sequelize como database connector e PostgreSQL como banco de dados relacional. O projeto está dockerizado, com suporte a Docker Compose para facilitar o processo de desenvolvimento e implantação.

O Microserviço de Payment é responsável por gerenciar todas as operações relacionadas a pagamentos no sistema. Ele é projetado para funcionar de forma independente e modular, integrando-se a outros microserviços, como o de Order e Customer, por meio de APIs.



### Tecnologias do Projeto

| Docker | PostgreSQL | Node.js  | NPM    |
|--------|------------|----------|--------|
| *      | *          | v16.15.0 | v8.5.5 |

### Membros do Projeto

| Nome             | RM        |
|------------------|-----------|
| Davi Corazza     | RM353340  |
| Francisco Wesley | RM353738  |
| Pedro Freitas    | RM353284  |
| Robson Anjos     | RM353341  |

#### `Link do Miro` - Documentação do sistema (DDD) com Event Storming, incluindo todos os passos/tipos de diagrama 
[Miro - Tech Challenge](https://miro.com/app/board/uXjVKWk2FRY=/?share_link_id=272701004394)

## Estrutura do Projeto

	src
	├── application
	│   ├── adpters
	│   ├── controllers
	│   ├── usecases
	│   └── utils
	├── domain
	│   └── entities
	├── infrastructure
	│   ├── config
	│   ├── external
	│   │   ├── api
	│   │   ├── database
	│   │   │   └── models
	│   ├── mappers
	│   └── routes   
	├── interfaces
	│   └── gateways   
	├── test
	└── main.ts

### Mais Detalhes
- `src:` Diretório principal onde o código fonte da aplicação está localizado.
	- `application:` Contém a lógica de aplicação, organizando a integração entre os casos de uso e os adaptadores.
		- `adapters:` Contém implementações de conexões externas.
		- `controllers:` Controladores que lidam com as requisições HTTP e orquestram os casos de uso.
		- `usecases:` Implementação dos casos de uso (regras de negócio) da aplicação.
		- `utils:` Utilitários e helpers genéricos.
	- `domain:` Contém a lógica central e as definições de negócio do sistema.
		- `entities:` Classes que representam os modelos de domínio.
	- `infrastructure:` Responsável pela infraestrutura e comunicação com serviços externos ou banco de dados.
		- `config:` Configurações gerais, como conexão com o banco de dados ou variáveis de ambiente.
		- `external:` Serviços externos que o sistema consome.
			- `api:` Comunicação com APIs de terceiros, como Mercado Pago.
			- `database:` Estruturação de persistência.	
				- `models:` Modelos do banco de dados (MongoDB, SQL, etc.).
		- `mappers:` Conversão entre as entidades de domínio e os modelos do banco de dados.
		- `routes:` Configuração das rotas HTTP e integração com os controladores.
	- `interfaces:` Define os gateways para comunicação entre diferentes camadas.
		- `gateways:` Interfaces para repositórios e gateways.
		- `ports:` Definição de interfaces para entrada e saída.
			- `in:` Interfaces para services e controllers.
			- `out:` Interfaces para repositórios e gateways.
		- `services:` Implementação dos casos de uso e lógica de negócio.		
	- `main.ts:` Ponto de entrada da aplicação.

## Iniciando a aplicação
- Clone o repositório:

		git clone https://github.com/team-tech-challenge/payment-service.git
		cd payment-service

- Construa e inicie os containers:

	*	Para Windows:

			docker-compose up --build

	*	Para Linux e macOS:

			docker compose up --build

- A aplicação estará disponível em http://localhost:3000.

## Documentação da API
A documentação da API, gerada com Swagger, estará disponível em http://localhost:3000/swagger/.
