# ATM CLI Application

A simple Command Line Interface (CLI) application that simulates ATM interactions between bank customers.

## Code - Github

[https://github.com/bonkx/atm-test-dkatalis.git](https://github.com/bonkx/atm-test-dkatalis.git)

## Design

The application separates responsibilities into:

- `Customer` – Domain entity responsible for account balance and business rules.
- `ATMService` – Application service responsible for customer sessions and transaction orchestration.
- `CommandParser` – CLI adapter responsible for parsing user commands and invoking application services.

## Features

### Authentication

- Login as a customer
- Automatically creates a customer if it does not exist
- Logout from the current session

### Account Management

- Deposit money into the current customer's account
- Withdraw money from the current customer's account
- View current balance after every transaction

### Transfer (Planned)

- Transfer money to another customer
- Automatically creates the target customer if it does not exist
- Supports partial transfer when balance is insufficient
- Records outstanding debt when transfer amount exceeds available balance

### Debt Management (Planned)

- Track debts between customers
- Display debts owed to other customers
- Display debts owed from other customers
- Automatically settle debts when a customer deposits money

## Project Structure

```text
src/
├── domain/
│   ├── Customer.ts
│   └── Debt.ts
│
├── services/
│   └── ATMService.ts
│
├── cli/
│   └── CommandParser.ts
│
└── index.ts

tests/
```

## Commands

```bash
login [name]
deposit [amount]
withdraw [amount]
transfer [target] [amount]
logout
```

## Running the Application

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

## Running Tests

Execute all tests:

```bash
npm test
```

## Implemented Tests

### Authentication

#### Login

- Creates a new customer when logging in for the first time
- Preserves customer balance when logging in again

#### Logout

- Clears the current session
- Throws an error when no customer is logged in

### Deposit

#### Valid Deposits

- Increases account balance
- Supports multiple deposits

#### Invalid Deposits

- Rejects zero amount deposits
- Rejects negative amount deposits
- Requires an authenticated customer session

### Withdraw

#### Valid Withdrawals

- Decreases account balance
- Allows withdrawing up to the available balance
- Supports withdrawing the entire available balance

#### Invalid Withdrawals

- Rejects zero amount withdrawals
- Rejects negative amount withdrawals
- Rejects withdrawals that exceed the available balance
- Requires an authenticated customer session
- Does not modify account balance when a withdrawal fails

## Assumptions

- Customer names are unique identifiers.
- All data is stored in memory.
- Application state is reset every time the application starts.
- Monetary values are represented as integers.
- A customer must be logged in before performing account operations.
