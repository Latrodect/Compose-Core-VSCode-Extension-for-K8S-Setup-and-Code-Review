import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export async function generateDockerFiles() {
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace is open.');
        return;
    }

    const projectRoot = await vscode.window.showInputBox({
        prompt: 'Root of your project:',
        placeHolder: 'Example Usage: D:/MyProject/src',
    });

    const contApplicaitons = await vscode.window.showInputBox({
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

    const dockerApplicationsPath = checkSpacesAndReplace(contApplicaitons.split(',').map(name => "../docker/" + name.trim()+"/Dockerfile"));

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
`
    const scriptFilePath = path.join(scriptsFolder.fsPath, 'docker_build_image.bash');
            await writeFileWithDirectoryCheck(scriptFilePath, scriptContent);

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
            await writeFileWithDirectoryCheck(dockerFilePath, dockerFileContent);
        }
    }
}

async function writeFileWithDirectoryCheck(filePath: string, content: string) {
    const folderPath = path.dirname(filePath);
    await fs.promises.mkdir(folderPath, { recursive: true });
    await fs.promises.writeFile(filePath, content);
}

function findApplicationFolder(projectRoot: string, applicationName: string): string | undefined {
  const folderPath = path.join(projectRoot, applicationName);

  try {
      const stat = fs.statSync(folderPath);
      if (stat.isDirectory()) {
          return folderPath;
      }
  } catch (error) {
    vscode.window.showWarningMessage('Folder does not exist.');
  }

  return undefined;
}

function checkSpacesAndReplace(variableList: string[]){
    return variableList.map((item) => item.replace(/ +/g, '_'))
  }