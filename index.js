import { stdin, stdout } from "process";
import os from "os";
import { exitMessage } from "./src/constants/exitMessage.js";
import { AppController } from "./src/controllers/AppController.js";

const appController = new AppController();

const argv = process.argv;
const userName = argv.find((argument) => argument.startsWith("--username"))?.split("=")[1];
const messageSplicer = os.platform() === "win32" ? "\r" : "\n";

stdout.write(`Welcome to the File Manager, ${userName}!\n`);

stdin.on("data", async (data) => {
    const messageFromUser = data.toString("utf-8").split(messageSplicer)[0];

    if (messageFromUser === exitMessage) {   
        stdin.emit("error");
        return;
    };

    try {
        await appController.commandHandler(messageFromUser);
    } catch (error) {
        console.warn(error.message);
    };

    stdout.write(`You are currently in ${appController.getCurrentPath()}\n`)
});

process.on("SIGINT", () => {
    stdin.emit("error");
    process.exit(0);
});

stdin.on("error", () => {
    stdout.write(`Thank you for using File Manager, ${userName}!\n`);
    stdin.destroy();
});
