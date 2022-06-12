import { stdout } from "process";
import { commands } from "../constants/commands.js";
import { inputErrorHandler } from "../errorHandlers/inputErrorHandler.js";
import { getHomedir } from "../os/getHomeDir.js";
import { CompressionService } from "../services/CompressionService.js";
import { FileSystemService } from "../services/FileSystemService.js";
import { HashService } from "../services/HashService.js";
import { NavigationService } from "../services/NavigationService.js";
import { OsService } from "../services/OsService.js";

export class AppController {
    constructor () {
        this.navigationService = new NavigationService(getHomedir());
        this.fileSystemService = new FileSystemService();
        this.osService = new OsService();
        this.hashService = new HashService();
        this.compressionService = new CompressionService();
    };

    commandHandler = async (data) => {
        const command = data.split(' ');
        const currentPath = this.getCurrentPath();

        switch (command[0]) {
            case commands.up:
                this.navigationService.up();
                this.printDirectory();
                break;

            case commands.cd:
                const targetDir = command.filter((item, index) => index !== 0).join(" ");
                await this.navigationService.cd(targetDir);
                this.printDirectory();
                break;

            case commands.ls:
                await this.navigationService.ls();
                this.printDirectory();
                break;

            case commands.cat:
                await this.fileSystemService.cat(command[1], currentPath, this.printDirectory);
                break;

            case commands.add:
                await this.fileSystemService.add(command[1], currentPath);
                this.printDirectory();
                break;

            case commands.rn:
                await this.fileSystemService.rn(command[1], command[2], currentPath);
                this.printDirectory();
                break;

            case commands.cp:
                await this.fileSystemService.cp(command[1], command[2], currentPath);
                this.printDirectory();
                break;

            case commands.mv:
                await this.fileSystemService.mv(command[1], command[2], currentPath);
                this.printDirectory();
                break;

            case commands.rm:
                await this.fileSystemService.rm(command[1], currentPath);
                this.printDirectory();
                break;

            case commands.os:
                this.osService.commandsHandler(command[1]);
                this.printDirectory();
                break;

            case commands.hash:
                await this.hashService.hash(command[1], currentPath, this.printDirectory);
                break;

            case commands.compress:
                await this.compressionService.compress(command[1], command[2], currentPath, this.printDirectory);
                break;

            case commands.decompress:
                await this.compressionService.decompress(command[1], command[2], currentPath, this.printDirectory);
                break;

            default:
                inputErrorHandler();
                break;
        }
    };

    getCurrentPath = () => {
        return this.navigationService.currentPath;
    };

    printDirectory = () => {
        stdout.write(`You are currently in ${this.getCurrentPath()}\n`);
    };
};
