import { commands } from "../constants/commands.js";
import { inputErrorHandler } from "../errorHandlers/inputErrorHandler.js";
import { getHomedir } from "../os/getHomeDir.js";
import { NavigationService } from "../services/NavigationService.js";

export class AppController {
    constructor () {
        this.navigationService = new NavigationService(getHomedir());
    };

    commandHandler = async (data) => {
        const command = data.split(' ');

        switch (command[0]) {
            case commands.up:
                this.navigationService.up();
                break;

            case commands.cd:
                const targetDir = command.filter((item, index) => index !== 0).join(" ");
                await this.navigationService.cd(targetDir);
                break;

            case commands.ls:
                await this.navigationService.ls();
                break;
        
            default:
                inputErrorHandler();
                break;
        }
    };

    getCurrentPath = () => {
        return this.navigationService.currentPath;
    };
};
