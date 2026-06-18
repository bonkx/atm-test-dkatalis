export class Customer {
    constructor(
        public readonly name: string,
        private balance: number = 0,
    ) { }

    getBalance(): number {
        return this.balance;
    }

    deposit(amount: number): void {
        this.balance += amount;
    }

    withdraw(amount: number): number {
        const withdrawn = Math.min(amount, this.balance);
        this.balance -= withdrawn;
        return withdrawn;
    }

    hasMoney(): boolean {
        return this.balance > 0;
    }
}