import { Customer } from "../domain/Customer.js";
import { Debt } from "../domain/Debt.js";

export class ATMService {
    private customers = new Map<string, Customer>();
    private debts = new Map<string, Debt>();

    private currentCustomer: Customer | undefined;

    // Helper methods

    private getOrCreateCustomer(name: string): Customer {
        let customer = this.customers.get(name);

        if (!customer) {
            customer = new Customer(name);
            this.customers.set(name, customer);
        }

        return customer;
    }

    private requireCurrentCustomer(): Customer {
        if (!this.currentCustomer) {
            throw new Error("No customer is currently logged in");
        }

        return this.currentCustomer;
    }

    private getDebtKey(from: string, to: string): string {
        return `${from}->${to}`;
    }

    private getOrCreateDebt(
        from: string,
        to: string,
    ): Debt {
        const key = this.getDebtKey(from, to);

        let debt = this.debts.get(key);

        if (!debt) {
            debt = new Debt(from, to, 0);
            this.debts.set(key, debt);
        }

        return debt;
    }



    // Public methods

    login(name: string): string[] {
        const customer = this.getOrCreateCustomer(name);

        this.currentCustomer = customer;

        const lines = [
            `Hello, ${customer.name}!`,
            `Your balance is $${customer.getBalance()}`,
        ];

        // append debt info

        return lines;
    }

    logout(): string[] {
        const customer = this.requireCurrentCustomer();

        this.currentCustomer = undefined;

        return [`Goodbye, ${customer.name}!`];
    }

    balance(): string[] {
        const customer = this.requireCurrentCustomer();

        return [
            `Your balance is $${customer.getBalance()}`
        ];
    }

    deposit(amount: number): string[] {
        const customer =
            this.requireCurrentCustomer();

        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        customer.deposit(amount);

        return [
            `Your balance is $${customer.getBalance()}`
        ];
    }

    withdraw(amount: number): string[] {
        const customer = this.requireCurrentCustomer();

        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        customer.withdraw(amount);

        return [
            `Your balance is $${customer.getBalance()}`
        ];
    }

    transfer(target: string, amount: number): string[] {
        const sender = this.requireCurrentCustomer();

        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        if (sender.name === target) {
            throw new Error("Cannot transfer to yourself");
        }

        const receiver =
            this.getOrCreateCustomer(target);

        const balance =
            sender.getBalance();

        if (balance >= amount) {
            sender.withdraw(amount);
            receiver.deposit(amount);
        } else {
            sender.withdraw(balance);
            receiver.deposit(amount);

            const debtAmount =
                amount - balance;

            const debt =
                this.getOrCreateDebt(
                    sender.name,
                    receiver.name,
                );

            debt.add(debtAmount);
        }

        return [
            `Transferred $${amount} to ${receiver.name}`,
            `Your balance is $${sender.getBalance()}`
        ];
    }

}