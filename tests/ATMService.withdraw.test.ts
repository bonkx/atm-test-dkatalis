import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { ATMService } from "../src/services/ATMService.js";

describe("ATMService.withdraw", () => {

    // Memastikan customer dapat menarik saldo yang tersedia.
    test("should withdraw money from current customer account", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.deposit(100);

        const result = atm.withdraw(50);

        assert.deepEqual(result, [
            "Your balance is $50",
        ]);
    });

    // Memastikan sistem menolak penarikan jika saldo tidak mencukupi.
    test("should reject withdrawal when balance is insufficient", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.deposit(30);

        assert.throws(
            () => atm.withdraw(50),
            /Insufficient balance/,
        );

    });

    // Memastikan sistem menolak penarikan dengan nominal negatif dan tidak mengubah saldo customer.
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

    // Memastikan nominal penarikan harus lebih besar dari nol.
    test("should throw error when amount is zero", () => {
        const atm = new ATMService();

        atm.login("Bob");
        atm.deposit(100);

        assert.throws(
            () => atm.withdraw(0),
            /Amount must be greater than 0/,
        );
    });

    // Memastikan hanya customer yang sedang login yang dapat melakukan penarikan.
    test("should throw error when no customer is logged in", () => {
        const atm = new ATMService();

        assert.throws(
            () => atm.withdraw(50),
            /No customer is currently logged in/,
        );
    });

    // Memastikan customer dapat menarik seluruh saldo hingga habis.
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