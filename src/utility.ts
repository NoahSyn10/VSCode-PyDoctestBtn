"use strict";
import * as vscode from "vscode";
let pyConst = vscode.workspace.getConfiguration('doctestbtn').dtPythonPath;

// Modified from vscode-code-runner to try and extract python path automatically
// https://github.com/formulahendry/vscode-code-runner/blob/2bed9aeeabc1118a5f3d75e47bdbcfaf412765ed/src/utility.ts#L6

export class Utility {
    public static getPythonPath(document: vscode.TextDocument): String {
        try {
            const extension = vscode.extensions.getExtension("ms-python.python");
            if (!extension) {
                return pyConst;
            }
            const usingNewInterpreterStorage = extension.packageJSON?.featureFlags?.usingNewInterpreterStorage;
            if (usingNewInterpreterStorage) {
                if (!extension.isActive) {
                    extension.activate();
                }
                const pythonPath = extension.exports.settings.getExecutionCommand(document?.uri).join(" ");
                return pythonPath;
            } else {
                return this.getConfiguration("python").pythonPath;
            }
        } catch (error) {
            return pyConst;
        }
    }

    public static getConfiguration(section?: string, document?: vscode.TextDocument): vscode.WorkspaceConfiguration {
        if (document) {
            return vscode.workspace.getConfiguration(section, document.uri);
        } else {
            return vscode.workspace.getConfiguration(section);
        }
    }
}