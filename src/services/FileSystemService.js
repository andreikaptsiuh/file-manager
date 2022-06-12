import fs from "fs";
import { writeFile, rename, cp, unlink } from "fs/promises";
import { inputErrorHandler } from "../errorHandlers/inputErrorHandler.js";
import { WorkingWithPathService } from "./WorkingWithPathService.js";

export class FileSystemService extends WorkingWithPathService {
    cat = async (readFilePath, currentPath, callbackForEndRead) => {
        const absoluteReadFilePath = this._getAbsolutePath(readFilePath, currentPath);
        const readStream = fs.createReadStream(absoluteReadFilePath);

        readStream.on('error', (error) => {
            readStream.destroy();
            console.log("Invalid input");
        });

        readStream.on("data", (chunk) => {
            console.log(chunk.toString())
        });

        readStream.on("end", () => {
            readStream.destroy();
            callbackForEndRead();
        });
    };

    add = async (createFilePath, currentPath) => {
        const absoluteCreateFilePath = this._getAbsolutePath(createFilePath, currentPath);

        try {
            await writeFile(absoluteCreateFilePath, "");
        } catch {
            inputErrorHandler();
        };
    };

    rn = async (filePath, newFilePath, currentPath) => {
        const absoluteFilePath = this._getAbsolutePath(filePath, currentPath);
        const absoluteNewFilePath = this._getAbsolutePath(newFilePath, currentPath);

        try {
            await rename(absoluteFilePath, absoluteNewFilePath);
        } catch {
            inputErrorHandler();
        };
    };

    // TODO: make cp working with streams api
    cp = async (filePath, copiedFilePath, currentPath) => {
        const absoluteFilePath = this._getAbsolutePath(filePath, currentPath);
        const absoluteCopiedFilePath = this._getAbsolutePath(copiedFilePath, currentPath);

        try {
            await cp(absoluteFilePath, absoluteCopiedFilePath);
        } catch {
            inputErrorHandler();
        };
    };

    mv = async (filePath, copiedFilePath, currentPath) => {
        const absoluteFilePath = this._getAbsolutePath(filePath, currentPath);
        const absoluteCopiedFilePath = this._getAbsolutePath(copiedFilePath, currentPath);

        try {
            await cp(absoluteFilePath, absoluteCopiedFilePath);
            await this.rm(absoluteFilePath, currentPath);
        } catch {
            inputErrorHandler();
        };
    };

    rm = async (filePath, currentPath) => {
        const absoluteFilePath = this._getAbsolutePath(filePath, currentPath);

        try {
            await unlink(absoluteFilePath);
        } catch {
            inputErrorHandler();
        };
    };
};
