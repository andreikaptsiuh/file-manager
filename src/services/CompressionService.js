import zlib from "zlib";
import fs from "fs";
import { WorkingWithPathService } from "./WorkingWithPathService.js";
import { pipeline } from "stream";
import { inputErrorHandler } from "../errorHandlers/inputErrorHandler.js";

export class CompressionService extends WorkingWithPathService {
    compress = async (fileForCompressPath, compressedFilePath, currentPath, callbackForEndStreams) => {
        const absoluteFileForCompressPath = this._getAbsolutePath(fileForCompressPath, currentPath);
        const absoluteCompressedFilePath = this._getAbsolutePath(compressedFilePath, currentPath);

        const brotliCompress = zlib.createBrotliCompress();
        const readStream = fs.createReadStream(absoluteFileForCompressPath);
        const writeStream = fs.createWriteStream(absoluteCompressedFilePath);
   
        pipeline(readStream, brotliCompress, writeStream, (err) => {
            try {
                if (err) inputErrorHandler();
                console.log("File compressed");
                callbackForEndStreams();
            } catch (error) {
                console.log(error.message);
            };
        });
    };

    decompress = async (compressedFilePath, decompressedFilePath, currentPath, callbackForEndStreams) => {
        const absoluteCompressedFilePath = this._getAbsolutePath(compressedFilePath, currentPath);
        const absoluteDecompressedFilePath = this._getAbsolutePath(decompressedFilePath, currentPath);

        const brotliDecompress = zlib.createBrotliDecompress();
        const readStream = fs.createReadStream(absoluteCompressedFilePath);
        const writeStream = fs.createWriteStream(absoluteDecompressedFilePath);

        pipeline(readStream, brotliDecompress, writeStream, (err) => {
            try {
                if (err) inputErrorHandler();
                console.log("File decompressed");
                callbackForEndStreams();
            } catch (error) {
                console.log(error.message);
            };
        });
    };
};
