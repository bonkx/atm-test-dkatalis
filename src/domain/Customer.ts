export class Customer {
    constructor(
        public readonly name: string,
        private balance: number = 0,
    ) { }

    getBalance(): number {
        return this.balance;
    }

    deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error("Invalid amount");
        }

        this.balance += amount;
    }

    withdraw(amount: number): number {
        if (amount <= 0) {
            throw new Error("Invalid amount");
        }

        if (amount > this.balance) {
            throw new Error("Insufficient balance");
        }

        const withdrawn = Math.min(amount, this.balance);
        this.balance -= withdrawn;
        return withdrawn;
    }

}