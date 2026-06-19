import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { ATMService } from "../src/services/ATMService.js";

describe("ATMService.deposit", () => {

    // Memastikan deposit menambah saldo customer.
    test("deposit should increase balance", () => {
        const atm = new ATMService();

        atm.login("Alice");

        const result = atm.deposit(100);

        assert.deepEqual(result, [
            "Your balance is $100",
        ]);
    });

    // Memastikan beberapa deposit berturut-turut terakumulasi ke saldo yang sama.
    test("multiple deposits should accumulate balance", () => {
        const atm = new ATMService();

        atm.login("Alice");

        atm.deposit(100);

        const result = atm.deposit(50);

        assert.deepEqual(result, [
            "Your balance is $150",
        ]);
    });

    // Memastikan sistem menolak deposit dengan nominal 0.
    test("deposit zero amount should throw", () => {
        const atm = new ATMService();

        atm.login("Alice");

        assert.throws(
            () => atm.deposit(0),
            /Amount must be greater than 0/,
        );
    });

    // Memastikan sistem menolak deposit dengan nominal negatif.
    test("deposit negative amount should throw", () => {
        const atm = new ATMService();

        atm.login("Alice");

        assert.throws(
            () => atm.deposit(-100),
            /Amount must be greater than 0/,
        );
    });

    // Memastikan deposit hanya bisa dilakukan oleh customer yang sedang login.
    test("deposit without login should throw", () => {
        const atm = new ATMService();

        assert.throws(
            () => atm.deposit(100),
            /No customer is currently logged in/,
        );
    });
});