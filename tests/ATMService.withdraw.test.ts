import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { ATMService } from "../src/services/ATMService.js";

describe("ATMService.withdraw", () => {

    // Ensure customer can withdraw available balance.
    test("should withdraw money from current customer account", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.deposit(100);

        const result = atm.withdraw(50);

        assert.deepEqual(result, [
            "Your balance is $50",
        ]);
    });

    // Ensure the system rejects withdrawals when the balance is insufficient.
    test("should reject withdrawal when balance is insufficient", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.deposit(30);

        assert.throws(
            () => atm.withdraw(50),
            /Insufficient balance/,
        );

    });

    // Ensure the system rejects withdrawals with an invalid amount and does not change the customer's balance.
    test("should not change balance when withdrawal amount is invalid", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.deposit(100);

        assert.throws(
            () => atm.withdraw(-10),
            /Amount must be greater than 0/,
        );

        const balance = atm.balance();

        assert.deepEqual(balance, [
            "Your balance is $100",
        ]);
    });

    // Ensure the withdrawal amount is greater than zero.
    test("should throw error when amount is zero", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.deposit(100);

        assert.throws(
            () => atm.withdraw(0),
            /Amount must be greater than 0/,
        );
    });

    // Ensure only logged-in customers can make withdrawals.
    test("should throw error when no customer is logged in", () => {
        const atm = new ATMService();

        assert.throws(
            () => atm.withdraw(50),
            /No customer is currently logged in/,
        );
    });

    // Ensure customers can withdraw their entire balance until it's depleted.
    test("should allow withdrawing exact balance", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.deposit(100);

        const result = atm.withdraw(100);

        assert.deepEqual(result, [
            "Your balance is $0",
        ]);
    });
});