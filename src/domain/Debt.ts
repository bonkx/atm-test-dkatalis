export class Debt {
    constructor(
        public readonly from: string,
        public readonly to: string,
        public amount: number,
    ) { }

    add(amount: number): void {
        this.amount += amount;
    }

    reduce(amount: number): void {
        this.amount = Math.max(0, this.amount - amount);
    }

    isSettled(): boolean {
        return this.amount === 0;
    }
}