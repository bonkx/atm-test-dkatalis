import test from "node:test";
import assert from "node:assert/strict";
import { ATMService } from "../src/services/ATMService.js";


test("login should create new customer", () => {
    const atm = new ATMService();

    const result = atm.login("Alice");

    assert.deepEqual(result, [
        "Hello, Alice!",
        "Your balance is $0",
    ]);
});

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

test("logout should clear current session", () => {
    const atm = new ATMService();

    atm.login("Alice");

    const result = atm.logout();

    assert.deepEqual(result, [
        "Goodbye, Alice!",
    ]);
});

test("logout without login should throw", () => {
    const atm = new ATMService();

    assert.throws(
        () => atm.logout(),
        /No customer logged in/,
    );
});