import { stdin, stdout } from "process";
import os from "os";
import { exitMessage } from "./src/constants/exitMessage.js";
import { getHomedir } from "./src/os/getHomeDir.js";

const argv = process.argv;
const userName = argv.find((argument) => argument.startsWith("--username")).split("=")[1];
const messageSplicer = os.platform() === "win32" ? "\r" : "\n";

stdout.write(`Welcome to the File Manager, ${userName}!\n`);

stdin.on("data", (data) => {
  
  const messageFromUser = data.toString("utf-8").split(messageSplicer)[0];

  if (messageFromUser === exitMessage) {   
    stdin.emit("error");
    return;
  };

  stdout.write(`You are currently in ${getHomedir()}\n`)
});

process.on("SIGINT", () => {
  stdin.emit("error");
  process.exit(0);
});

stdin.on("error", () => {
  stdout.write(`Thank you for using File Manager, ${userName}!\n`);
  stdin.destroy();
});
