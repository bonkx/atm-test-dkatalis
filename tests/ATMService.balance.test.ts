import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { ATMService } from "../src/services/ATMService.js";

describe("ATMService.balance", () => {

    // Balance menampilkan saldo customer aktif
    test("should return current balance", () => {
        const atm = new ATMService();

        atm.login("Alice");
        atm.deposit(100);

        const result = atm.balance();

        assert.deepEqual(result, [
            "Your balance is $100",
        ]);
    });

    // Balance tidak bisa diakses tanpa login
    test('should throw when no customer logged in', () => {
        const service = new ATMService();

        assert.throws(
            () => service.balance(),
            /No customer is currently logged in/,
        );
    });

    // Customer baru memiliki saldo awal 0
    test("should return zero balance for new customer", () => {
        const atm = new ATMService();

        atm.login("Alice");

        assert.deepEqual(
            atm.balance(),
            ["Your balance is $0"],
        );
    });

    // Balance selalu mengikuti transaksi terbaru
    test("should reflect latest balance after deposit and withdrawal", () => {
        const atm = new ATMService();

        atm.login("Alice");
        atm.deposit(100);
        atm.withdraw(30);

        assert.deepEqual(
            atm.balance(),
            ["Your balance is $70"],
        );
    });
});