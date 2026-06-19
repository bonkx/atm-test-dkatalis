import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { ATMService } from "../src/services/ATMService.js";

describe("ATMService.auth", () => {

    // Customer baru dibuat otomatis saat login pertama
    test("login should create new customer", () => {
        const atm = new ATMService();

        const result = atm.login("Alice");

        assert.deepEqual(result, [
            "Hello, Alice!",
            "Your balance is $0",
        ]);
    });

    // Data customer tersimpan setelah logout/login
    test("login existing customer should keep balance", () => {
        const atm = new ATMService();

        atm.login("Alice");
        atm.deposit(100);
        atm.logout();

        const result = atm.login("Alice");

        assert.deepEqual(result, [
            "Hello, Alice!",
            "Your balance is $100",
        ]);
    });

    // Session berpindah ke customer yang baru login
    test("should switch session when another customer logs in", () => {
        const atm = new ATMService();

        atm.login("Alice");
        atm.deposit(100);

        atm.login("Bob");

        const result = atm.balance();

        assert.deepEqual(result, [
            "Your balance is $0",
        ]);
    });

    // Logout menghapus session aktif
    test("logout should clear current session", () => {
        const atm = new ATMService();

        atm.login("Alice");

        const result = atm.logout();

        assert.deepEqual(result, [
            "Goodbye, Alice!",
        ]);
    });

    // Operasi invalid menghasilkan error
    test("logout without login should throw", () => {
        const atm = new ATMService();

        assert.throws(
            () => atm.logout(),
            /No customer is currently logged in/,
        );
    });
});