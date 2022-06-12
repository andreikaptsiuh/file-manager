import path from "path";
import { stat, readdir } from "fs/promises";
import { operationErrorHandler } from "../errorHandlers/operationErrorHandler.js";

export class NavigationService {
    constructor(currentPath) {
        this.currentPath = currentPath;
        this.rootDir = path.parse(this.currentPath).root;
    }

    up = () => {
        const dirPath = path.dirname(this.currentPath);    
        if (dirPath === this.rootDir) return;       
        this.currentPath = path.join(dirPath);
    };

    cd = async (dirPath) => {
        let absolutePath = "";

        if (path.isAbsolute(dirPath)) {
            absolutePath = dirPath;
        } else {
            absolutePath = path.join(this.currentPath, dirPath);
        };

        await this._checkDirectory(absolutePath);
        this.currentPath = absolutePath;
    };

    ls = async () => {
        try {
            const list = await readdir(this.currentPath);
            console.log(list);
        } catch (error) {
            operationErrorHandler();
        }
    }

    getPath = () => {
        return this.currentPath;
    };

    _checkDirectory = async (dirPath) => {
        try {
            await stat(dirPath);
        } catch {
            operationErrorHandler();
        };  
    };
};
