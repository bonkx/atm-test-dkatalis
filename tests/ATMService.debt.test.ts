import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { ATMService } from "../src/services/ATMService.js";

describe("ATMService.debt", () => {
    test("should merge debt to same creditor", () => {
        const atm = new ATMService();

        atm.login("Alice");

        atm.transfer("Bob", 100);
        atm.transfer("Bob", 50);

        atm.logout();

        assert.deepEqual(
            atm.login("Alice"),
            [
                "Hello, Alice!",
                "Your balance is $0",
                "Owed $150 to Bob",
            ]
        );
    });

    test("should create debt when transfer exceeds balance", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.deposit(30);

        assert.deepStrictEqual(
            atm.transfer("Alice", 100),
            [
                "Transferred $30 to Alice",
                "Your balance is $0",
                "Owed $70 to Alice",
            ],
        );
    });

    test("should repay debt on deposit", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.transfer("Alice", 100);

        assert.deepStrictEqual(
            atm.deposit(30),
            [
                "Transferred $30 to Alice",
                "Your balance is $0",
                "Owed $70 to Alice",
            ],
        );
    });

    test("should reduce debt when creditor transfers to debtor", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.transfer("Alice", 100);

        atm.logout();

        atm.login("Alice");
        atm.deposit(100);

        assert.deepStrictEqual(
            atm.transfer("Bob", 30),
            [
                "Your balance is $100",
                "Owed $70 from Bob",
            ],
        );
    });

    test("should settle debt then transfer remaining amount", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.transfer("Alice", 40);

        atm.logout();

        atm.login("Alice");
        atm.deposit(100);

        assert.deepStrictEqual(
            atm.transfer("Bob", 100),
            [
                "Transferred $60 to Bob",
                "Your balance is $40",
            ],
        );
    });

    test("should show debt owed from another customer", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.transfer("Alice", 100);

        atm.logout();

        assert.deepStrictEqual(
            atm.login("Alice"),
            [
                "Hello, Alice!",
                "Your balance is $0",
                "Owed $100 from Bob",
            ],
        );
    });

    test("should remove debt when fully repaid", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.transfer("Alice", 100);

        atm.deposit(100);

        atm.logout();

        assert.deepStrictEqual(
            atm.login("Bob"),
            [
                "Hello, Bob!",
                "Your balance is $0",
            ],
        );
    });

    test("should keep remaining amount after debt repayment", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.transfer("Alice", 10);

        assert.deepStrictEqual(
            atm.deposit(100),
            [
                "Transferred $10 to Alice",
                "Your balance is $90",
            ],
        );
    });

    test("should fully settle debt when creditor transfers exact debt amount", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.transfer("Alice", 40);

        atm.logout();

        atm.login("Alice");

        assert.deepStrictEqual(
            atm.transfer("Bob", 40),
            [
                "Your balance is $0",
            ],
        );
    });

    test("should keep debts to multiple creditors separately", () => {
        const atm = new ATMService();

        atm.login("Bob");

        atm.transfer("Alice", 100);
        atm.transfer("Charlie", 50);

        atm.logout();

        assert.deepStrictEqual(
            atm.login("Bob"),
            [
                "Hello, Bob!",
                "Your balance is $0",
                "Owed $100 to Alice",
                "Owed $50 to Charlie",
            ],
        );
    });

    test("should consume entire balance before creating debt", () => {
        const atm = new ATMService();

        atm.login("Alice");
        atm.deposit(100);

        assert.deepStrictEqual(
            atm.transfer("Bob", 150),
            [
                "Transferred $100 to Bob",
                "Your balance is $0",
                "Owed $50 to Bob",
            ],
        );
    });
});