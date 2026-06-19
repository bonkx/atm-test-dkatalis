# ATM CLI Application

A simple Command Line Interface (CLI) application that simulates ATM interactions between bank customers.

## Code - Github

[https://github.com/bonkx/atm-test-dkatalis.git](https://github.com/bonkx/atm-test-dkatalis.git)

## Overview

This application provides a simplified ATM system where customers can:

- Login and logout
- Deposit funds
- Withdraw funds
- Check account balances
- Transfer money between customers
- Manage debts created by insufficient transfer balances

The application is implemented using TypeScript and follows a simple layered architecture that separates domain logic, application services, and CLI concerns.

---

## Tech Stack

- TypeScript
- Node.js
- Node Test Runner (`node:test`)

---

## Architecture

The application separates responsibilities into the following layers:

### Customer

Domain entity responsible for:

- Managing customer balances
- Validating deposits and withdrawals
- Enforcing account-related business rules

### Debt

Domain entity responsible for:

- Representing debt relationships between customers
- Tracking creditor and debtor information
- Managing debt amounts

### ATMService

Application service responsible for:

- Customer session management
- Transaction orchestration
- Transfer processing
- Debt settlement coordination

### CommandParser

CLI adapter responsible for:

- Parsing user input
- Validating command structure
- Invoking application services
- Displaying output messages

---

## Design Rationale

The application follows a lightweight layered architecture.

- Domain entities contain business rules and state.
- ATMService coordinates use cases and transactions.
- CommandParser handles user interaction only.

This separation improves maintainability and testability while keeping the implementation simple.

---

## Design Decisions

- Business rules related to balances are encapsulated inside the `Customer` entity.
- `ATMService` acts as the application layer and coordinates interactions between customers.
- CLI concerns are isolated from business logic through `CommandParser`.
- In-memory storage is used to keep the implementation simple and focused on domain behavior.
- Domain entities remain independent from infrastructure and presentation concerns.

---

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

---

## Features

### Authentication

- Login as a customer
- Automatically creates a customer if it does not exist
- Logout from the current session

### Account Management

- Deposit money into the current customer's account
- Withdraw money from the current customer's account
- Check the current account balance
- View current balance after every transaction

### Transfer

- Transfer funds to another customer
- Automatically creates the target customer if it does not exist
- Supports partial transfer when balance is insufficient
- Records outstanding debt when transfer amount exceeds available balance

### Debt Management

- Track debts between customers
- Display debts owed to other customers
- Display debts owed from other customers
- Automatically settle debts when a customer deposits money

---

## Business Rules

### Customer

- Customer names are unique identifiers.
- Customers are automatically created on first login.
- A customer must be logged in before performing account operations.

### Deposits

- Deposit amount must be greater than zero.
- Deposits increase the customer's balance.

### Withdrawals

- Withdrawal amount must be greater than zero.
- Withdrawal amount cannot exceed available balance.

### Transfers

- Transfers can be performed only by logged-in customers.
- If balance is sufficient, the full amount is transferred.
- If balance is insufficient:
  - Available balance is transferred.
  - Remaining amount becomes debt.
- Existing debts are settled before creating new transfers.

### Debt Settlement

- Debt is tracked per creditor and debtor pair.
- Multiple debts between the same customers are merged.
- Debt settlement occurs automatically whenever possible.

---

## Commands

```bash
login [name]
deposit [amount]
withdraw [amount]
balance
transfer [target] [amount]
logout
```

---

## Example Usage

```bash
> login Alice
Hello, Alice!

> deposit 100
Your balance is $100

> transfer Bob 150
Transferred $100 to Bob
You owe Bob $50
Your balance is $0

> logout
Goodbye, Alice!
```

---

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

## Running with Shell Script

Start application:

```bash
./start.sh
```

---

## Test Coverage

### Authentication

#### Login

- Creates a new customer on first login
- Reuses existing customer accounts
- Preserves account balance across sessions

#### Logout

- Clears active session
- Rejects logout when no session exists

### Deposit

#### Valid Deposits

- Increases account balance
- Supports multiple deposits

#### Invalid Deposits

- Rejects zero amounts
- Rejects negative amounts
- Requires an authenticated session

### Withdraw

#### Valid Withdrawals

- Decreases account balance
- Allows withdrawing up to the available balance
- Supports withdrawing the entire available balance

#### Invalid Withdrawals

- Rejects zero amounts
- Rejects negative amounts
- Rejects withdrawals exceeding balance
- Requires an authenticated session
- Preserves balance when validation fails

### Balance

#### Valid Balance Checks

- Returns current customer balance

#### Invalid Balance Checks

- Requires an authenticated session

### Transfer

#### Valid Transfers

- Transfers funds to another customer
- Automatically creates the target customer if it does not exist
- Supports partial transfers when balance is insufficient
- Creates debt records for any unpaid amount
- Automatically settles existing debts before creating new ones

#### Invalid Transfers

- Rejects invalid amounts
- Rejects transfers without authentication
- Rejects self-transfers

### Debt

#### Debt Tracking

- Creates debt records for insufficient transfers
- Merges debts between the same customer pair
- Automatically settles debt when possible

---

## Assumptions

- Customer names are unique identifiers.
- All data is stored in memory.
- Data is not persisted between application runs.
- Monetary values are represented as integers.
- A customer must be logged in before performing account operations.
- Single-user CLI interaction is assumed.
