"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDockerFiles = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function generateDockerFiles() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!vscode.workspace.workspaceFolders) {
            vscode.window.showErrorMessage('No workspace is open.');
            return;
        }
        const projectRoot = yield vscode.window.showInputBox({
            prompt: 'Root of your project:',
            placeHolder: 'Example Usage: D:/MyProject/src',
        });
        const contApplicaitons = yield vscode.window.showInputBox({
            prompt: 'Your Apps:',
            placeHolder: 'Example Usage(application folder names): frontned, backend, sync',
        });
        if (!contApplicaitons) {
            vscode.window.showWarningMessage('Please specify at least one application path.');
            return;
        }
        if (!projectRoot) {
            vscode.window.showWarningMessage('Please provide root path.');
            return;
        }
        const dockerFolder = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'docker');
        fs.mkdirSync(dockerFolder.fsPath, { recursive: true });
        const scriptsFolder = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'scripts');
        fs.mkdirSync(scriptsFolder.fsPath, { recursive: true });
        const dockerApplicationsPath = checkSpacesAndReplace(contApplicaitons.split(',').map(name => "../docker/" + name.trim() + "/Dockerfile"));
        const scriptContent = `
#!/bin/bash

# Define the applications and their Dockerfile paths
APPLICATIONS=(${contApplicaitons})
DOCKERFILES=("${dockerApplicationsPath}")

# Loop through each application and build the Docker image
for ((i=0; i<\${#APPLICATIONS[@]}; i++)); do
    APP_NAME="\${APPLICATIONS[$i]}"
    DOCKERFILE="\${DOCKERFILES[$i]}"
    echo "Building Docker image for $APP_NAME..."
    
    # Check if the Dockerfile exists
    if [ ! -f "$DOCKERFILE" ]; then
        echo "Dockerfile not found for $APP_NAME."
        continue
    fi
    
    # Build the Docker image
    docker build -t "$APP_NAME:latest" -f "$DOCKERFILE" .
    
    echo "Docker image for $APP_NAME built."
    echo
done

echo "All Docker images built."
`;
        const scriptFilePath = path.join(scriptsFolder.fsPath, 'docker_build_image.bash');
        yield writeFileWithDirectoryCheck(scriptFilePath, scriptContent);
        const dockerApplications = checkSpacesAndReplace(contApplicaitons.split(',').map(name => name.trim()));
        for (const appName of dockerApplications) {
            const appFolder = vscode.Uri.joinPath(dockerFolder, appName);
            fs.mkdirSync(appFolder.fsPath, { recursive: true });
            const folderPath = findApplicationFolder(projectRoot, appName);
            if (folderPath) {
                const dockerFileContent = `
# Use a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY ${folderPath} ./src/${appName}

# Expose a port (if needed)
EXPOSE 3000

# Specify the command to run when the container starts
CMD ["npm run start"]
                                    `;
                const dockerFilePath = path.join(appFolder.fsPath, 'Dockerfile');
                yield writeFileWithDirectoryCheck(dockerFilePath, dockerFileContent);
            }
        }
    });
}
exports.generateDockerFiles = generateDockerFiles;
function writeFileWithDirectoryCheck(filePath, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = path.dirname(filePath);
        yield fs.promises.mkdir(folderPath, { recursive: true });
        yield fs.promises.writeFile(filePath, content);
    });
}
function findApplicationFolder(projectRoot, applicationName) {
    const folderPath = path.join(projectRoot, applicationName);
    try {
        const stat = fs.statSync(folderPath);
        if (stat.isDirectory()) {
            return folderPath;
        }
    }
    catch (error) {
        vscode.window.showWarningMessage('Folder does not exist.');
    }
    return undefined;
}
function checkSpacesAndReplace(variableList) {
    return variableList.map((item) => item.replace(/ +/g, '_'));
}
//# sourceMappingURL=generateDockerFiles.js.map