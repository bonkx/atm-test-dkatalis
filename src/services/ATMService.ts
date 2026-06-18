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

    private getDebt(
        from: string,
        to: string,
    ): Debt | undefined {
        return this.debts.get(
            this.getDebtKey(from, to)
        );
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

    private getDebtsOwedBy(name: string): Debt[] {
        return [...this.debts.values()]
            .filter(debt => debt.from === name);
    }

    private getDebtsOwedTo(name: string): Debt[] {
        return [...this.debts.values()]
            .filter(debt => debt.to === name);
    }

    private cleanupDebts(): void {
        for (const [key, debt] of this.debts.entries()) {
            if (debt.isSettled()) {
                this.debts.delete(key);
            }
        }
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
        const owedTo =
            this.getDebtsOwedBy(customer.name);

        for (const debt of owedTo) {
            lines.push(
                `Owed $${debt.amount} to ${debt.to}`
            );
        }

        const owedFrom =
            this.getDebtsOwedTo(customer.name);

        for (const debt of owedFrom) {
            lines.push(
                `Owed $${debt.amount} from ${debt.from}`
            );
        }

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

        let remaining = amount;

        const lines: string[] = [];

        const debts =
            this.getDebtsOwedBy(customer.name);

        for (const debt of debts) {
            if (remaining === 0) {
                break;
            }

            const payment = Math.min(
                remaining,
                debt.amount,
            );

            debt.reduce(payment);

            const creditor =
                this.getOrCreateCustomer(
                    debt.to,
                );

            creditor.deposit(payment);

            lines.push(
                `Transferred $${payment} to ${creditor.name}`
            );

            remaining -= payment;
        }

        if (remaining > 0) {
            customer.deposit(remaining);
        }

        this.cleanupDebts();

        lines.push(
            `Your balance is $${customer.getBalance()}`
        );

        for (const debt of this.getDebtsOwedBy(customer.name)) {
            lines.push(
                `Owed $${debt.amount} to ${debt.to}`
            );
        }

        return lines;
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

        // Receiver owes sender
        const receivable = this.getDebt(
            receiver.name,
            sender.name,
        );

        if (receivable) {
            const settled = Math.min(
                receivable.amount,
                amount,
            );

            receivable.reduce(settled);

            this.cleanupDebts();

            const remaining = amount - settled;

            // Debt fully handled
            if (remaining === 0) {
                return [
                    `Your balance is $${sender.getBalance()}`,
                    ...this.getDebtsOwedTo(sender.name)
                        .map(
                            debt =>
                                `Owed $${debt.amount} from ${debt.from}`
                        ),
                ];
            }

            // Continue with remaining amount
            amount = remaining;
        }


        const balance = sender.getBalance();

        const transferred =
            Math.min(balance, amount);

        if (transferred > 0) {
            sender.withdraw(transferred);
            receiver.deposit(transferred);
        }

        const debtAmount =
            amount - transferred;

        if (debtAmount > 0) {
            this.getOrCreateDebt(
                sender.name,
                receiver.name,
            ).add(debtAmount);
        }

        const lines = [
            `Transferred $${transferred} to ${receiver.name}`,
            `Your balance is $${sender.getBalance()}`,
        ];

        if (debtAmount > 0) {
            lines.push(
                `Owed $${debtAmount} to ${receiver.name}`
            );
        }

        return lines;

    }

}