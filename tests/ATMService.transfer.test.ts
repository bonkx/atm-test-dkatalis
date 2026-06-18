import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { ATMService } from "../src/services/ATMService.js";

describe("ATMService.transfer", () => {
    test("should transfer using available balance", () => {
        const atm = new ATMService();

        atm.login("Alice");

        atm.deposit(100);

        atm.transfer("Bob", 50);

        atm.logout();

        atm.login("Alice");

        assert.deepEqual(atm.balance(), [
            "Your balance is $50"
        ]);
    });

    test("should create debt when transfer exceeds balance", () => {
        const atm = new ATMService();

        atm.login("Alice");

        atm.deposit(100);

        atm.transfer("Bob", 150);

        atm.logout();

        atm.login("Alice");

        assert.deepEqual(atm.balance(), [
            "Your balance is $0"
        ]);
    });

    test("transfer without login should throw", () => {
        const atm = new ATMService();

        assert.throws(
            () => atm.transfer("Bob", 50),
            /No customer is currently logged in/,
        );
    });
});