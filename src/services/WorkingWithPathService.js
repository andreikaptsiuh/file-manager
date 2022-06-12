import path from "path";

export class WorkingWithPathService {
    _getAbsolutePath = (filePath, currentPath) => {
        let absoluteFilePath;

        if (!path.isAbsolute(filePath)) {
            absoluteFilePath = path.join(currentPath, filePath);
        } else {
            absoluteFilePath = filePath;
        };

        return absoluteFilePath;
    };
};
