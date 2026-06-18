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
        return [];
    }

}