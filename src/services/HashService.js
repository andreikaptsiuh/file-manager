import fs from "fs";
import { createHash } from "crypto";
import { WorkingWithPathService } from "./WorkingWithPathService.js";

export class HashService extends WorkingWithPathService {
    hash = (filePath, currentPath, callbackForEndRead) => {
        const absoluteFilePath = this._getAbsolutePath(filePath, currentPath);
        const readStream = fs.createReadStream(absoluteFilePath);
        const hash = createHash("sha256");

        readStream.on('error', (error) => {
            readStream.destroy();
            console.log("Invalid input");
        });

        readStream.on("readable", () => {
            const data = readStream.read();

            if (data) {
                hash.update(data);
            } else {
                console.log(hash.digest("hex"));
            };
        });

        readStream.on("end", () => {
            readStream.destroy();
            callbackForEndRead();
        });
    };
};
