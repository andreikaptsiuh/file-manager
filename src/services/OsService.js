import os from "os";
import { osCommands } from "../constants/commands.js";
import { inputErrorHandler } from "../errorHandlers/inputErrorHandler.js";

export class OsService {
    commandsHandler = (command) => {
        switch (command) {
            case osCommands.eol:
                this.eol();
                break;

            case osCommands.cpus:
                this.cpus();
                break;

            case osCommands.homedir:
                this.homeDir();
                break;

            case osCommands.username:
                this.userName();
                break;

            case osCommands.architecture:
                this.architecture();
                break;
        
            default:
                inputErrorHandler();
                break;
        }
    };

    eol = () => {
        const eol = os.EOL;
        console.log(JSON.stringify(eol));
    };

    cpus = () => {
        const cpus = os.cpus().map((item) => {
            return { model: item.model, speed: item.speed };
        });
        console.log(cpus);
    };

    homeDir = () => {
        const homeDir = os.homedir();
        console.log(homeDir);
    };

    userName = () => {
        const userinfo = os.userInfo();
        console.log(userinfo.username);
    };

    architecture = () => {
        const arch = os.arch();
        console.log(arch);
    };
};
