import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { ATMService } from "../src/services/ATMService.js";

describe("ATMService.transfer", () => {

    // Transfer mengurangi saldo pengirim
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

    // Transfer negatif ditolak
    test("transfer negative amount should throw", () => {
        const atm = new ATMService();

        atm.login("Alice");
        atm.deposit(100);

        assert.throws(
            () => atm.transfer("Bob", -50),
            /Amount must be greater than 0/,
        );
    });

    // Transfer ke diri sendiri ditolak
    test("transfer to self should throw", () => {
        const atm = new ATMService();

        atm.login("Alice");
        atm.deposit(100);

        assert.throws(
            () => atm.transfer("Alice", 50),
            /Cannot transfer to yourself/,
        );
    });

    // Harus login
    test("transfer without login should throw", () => {
        const atm = new ATMService();

        assert.throws(
            () => atm.transfer("Bob", 50),
            /No customer is currently logged in/,
        );
    });

    // Transfer menambah saldo penerima
    test("should transfer money to another customer", () => {
        const atm = new ATMService();

        atm.login("Alice");
        atm.deposit(100);

        atm.transfer("Bob", 50);

        atm.logout();

        atm.login("Bob");

        assert.deepEqual(
            atm.balance(),
            ["Your balance is $50"],
        );
    });

    // Transfer 0 ditolak
    test("transfer zero amount should throw", () => {
        const atm = new ATMService();

        atm.login("Alice");
        atm.deposit(100);

        assert.throws(
            () => atm.transfer("Bob", 0),
            /Amount must be greater than 0/,
        );
    });
});