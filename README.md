# Backdoor Kubernetes & Docker Helper and Code Reviewer Extension

The **Backdoor Kubernetes & Docker Helper and Code Reviewer** extension for Visual Studio Code aims to enhance the code review process, streamline collaboration, and improve code quality within your projects. And also this extension aims to generate kubenetes and docker structure auto.

## Features

- Kubernetes and Docker folder structure and file generator.
- Create Docker Compose yaml
- Add inline comments to specific lines of code for discussions and feedback.
- AI-powered suggestions to provide constructive feedback for code reviews.


## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon in the sidebar or press `Ctrl+Shift+X`.
3. Search for "Backdoor Code Reviewer" and click "Install".

## Usage
### Open Backdoor Dashboard for Detailed Information

1. Use the keyboard shortcut `Ctrl+I` to trigger the "Backdoor: Dashboard" command.
2. This dashboard include more detailed documentation of this extension.

### Generate Kubernetes Deployment Files

<img src="https://kubernetes.io/images/kubernetes-horizontal-color.png" width="50" height="50">

1. Use the keyboard shortcut `Ctrl+F` to trigger the "Backdoor: Generate Kubernetes Files" command.
2. Enter the names of your apps (e.g., backend, frontend) separated by commas.
3. Backdoor will create Kubernetes YAML files for your apps.

### Generate Docker Files

<img src="https://d1.awsstatic.com/acs/characters/Logos/Docker-Logo_Horizontel_279x131.b8a5c41e56b77706656d61080f6a0217a3ba356d.png" width="50" height="50">

1. Use the keyboard shortcut `Ctrl+D` to trigger the "Backdoor: Generate Docker Files" command.
2. Enter the root of your project (e.g., /src/fronend) separated by commas.
3. Enter the names of your apps (e.g., backend, frontend) separated by commas.
4. Backdoor will create Dockerfile template for your project.

### Generate Docker Compose

1. Use the command palette (`Ctrl+Shift+P`) and search for "Backdoor Docker Compose: Generate Docker Compose YAML".
2. Enter the how many service do you have.
3. Enter service name and port.
4. Enter environment variables of that service.
5. Provide these information for each service.
### Analyze Code

Note: This function not completed yet. When its completed you can analyze your code.
1. Open a code file you want to analyze.
2. Use the command palette (`Ctrl+Shift+P`) and search for "Backdoor Code Reviewer: Analyze Code".
3. The extension will highlight potential issues and coding standards violations within the code.

### Add Inline Comment

1. Select the line of code where you want to add an inline comment.
2. Use the command palette (`Ctrl+Shift+P`) and search for "Backdoor Code Reviewer: Add Inline Comment".
3. An inline comment will be added to the selected line.


## Configuration

This extension provides customizable configuration settings that you can adjust to your preferences. Check the VS Code settings for options related to the Backdoor Code Reviewer extension.

## Contributing

Contributions are welcome! To contribute to this extension, follow these steps:

1. Fork this repository.
2. Clone your forked repository to your local machine.
3. Make your changes and improvements.
4. Test your changes thoroughly.
5. Commit your changes with clear commit messages.
6. Push your changes to your forked repository.
7. Create a pull request to this repository.

Please follow the [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This extension is licensed under the [MIT License](LICENSE).


