import { ATMService } from "../services/ATMService.js";

export class CommandParser {
    constructor(private readonly atmService: ATMService) { }

    private print(lines: string[]): void {
        for (const line of lines) {
            console.log(line);
        }
    }

    execute(input: string): void {
        const [command, ...args] = input.trim().split(/\s+/);

        switch (command?.toLowerCase()) {
            case "login":
                this.handleLogin(args);
                break;

            case "deposit":
                this.handleDeposit(args);
                break;

            case "withdraw":
                this.handleWithdraw(args);
                break;

            case "balance":
                this.handleBalance();
                break;

            case "transfer":
                this.handleTransfer(args);
                break;

            case "logout":
                this.handleLogout();
                break;

            default:
                console.log("Unknown command");
        }
    }

    private handleLogin(args: string[]): void {
        const [name] = args;

        if (!name) {
            console.log("Usage: login [name]");
            return;
        }

        const result = this.atmService.login(name);

        this.print(result);
    }

    private handleDeposit(args: string[]): void {
        const [rawAmount] = args;

        if (!rawAmount) {
            console.log("Usage: deposit [amount]");
            return;
        }

        const amount = Number(rawAmount);

        const result = this.atmService.deposit(amount);

        this.print(result);
    }

    private handleWithdraw(args: string[]): void {
        const [rawAmount] = args;

        if (!rawAmount) {
            console.log("Usage: withdraw [amount]");
            return;
        }

        const amount = Number(rawAmount);

        const result = this.atmService.withdraw(amount);

        this.print(result);
    }

    private handleBalance(): void {
        const result = this.atmService.balance();

        this.print(result);
    }

    private handleTransfer(args: string[]): void {
        const [target, rawAmount] = args;

        if (!target || !rawAmount) {
            console.log("Usage: transfer [target] [amount]");
            return;
        }

        const amount = Number(rawAmount);

        const result = this.atmService.transfer(target, amount);

        this.print(result);
    }

    private handleLogout(): void {
        const result = this.atmService.logout();

        this.print(result);
    }
}
