import readline from "node:readline";

import { ATMService } from "./services/ATMService.js";
import { CommandParser } from "./cli/CommandParser.js";

const atmService = new ATMService();
const parser = new CommandParser(atmService);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "$ ",
});

rl.prompt();

rl.on("line", (line) => {
    try {
        parser.execute(line);
    } catch (error) {
        console.log(
            error instanceof Error
                ? error.message
                : "Unexpected error",
        );
    }

    rl.prompt();
});

rl.on("close", () => {
    process.exit(0);
});