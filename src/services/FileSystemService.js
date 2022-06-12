import fs from "fs";
import { rename, unlink } from "fs/promises";
import { pipeline } from "stream";
import { inputErrorHandler } from "../errorHandlers/inputErrorHandler.js";
import { WorkingWithPathService } from "./WorkingWithPathService.js";

export class FileSystemService extends WorkingWithPathService {
    cat = async (readFilePath, currentPath, callbackForEndRead) => {
        const absoluteReadFilePath = this._getAbsolutePath(readFilePath, currentPath);
        const readStream = fs.createReadStream(absoluteReadFilePath);

        readStream.on("error", (error) => {
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

    add = async (createFilePath, currentPath, callbackForEndWrite) => {
        const absoluteCreateFilePath = this._getAbsolutePath(createFilePath, currentPath);
        const writeStream = fs.createWriteStream(absoluteCreateFilePath);

        writeStream.on("error", (error) => {
            writeStream.destroy();
            console.log("Invalid input");
        });

        writeStream.end("", () => {
            writeStream.destroy();
            callbackForEndWrite();
        });
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

    cp = async (filePath, copiedFilePath, currentPath, callbackForEndStreams) => {
        const absoluteFilePath = this._getAbsolutePath(filePath, currentPath);
        const absoluteCopiedFilePath = this._getAbsolutePath(copiedFilePath, currentPath);

        const readStream = fs.createReadStream(absoluteFilePath);
        const writeStream = fs.createWriteStream(absoluteCopiedFilePath);

        pipeline(readStream, writeStream, (err) => {
            try {
                if (err) inputErrorHandler();
                callbackForEndStreams && callbackForEndStreams();
            } catch (error) {
                console.log(error.message);
            };
        });
    };

    mv = async (filePath, copiedFilePath, currentPath, callbackForEndStreams) => {
        const absoluteFilePath = this._getAbsolutePath(filePath, currentPath);
        const absoluteCopiedFilePath = this._getAbsolutePath(copiedFilePath, currentPath);

        try {
            await this.cp(absoluteFilePath, absoluteCopiedFilePath);
            await this.rm(absoluteFilePath, currentPath);
            callbackForEndStreams();
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
