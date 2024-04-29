/**
 * VSCode-PyDoctestBtn
 * ConfigurationService.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

/**
 * ConfigurationService
 */
export class ConfigurationService {
	public static getConfiguration(section?: string, document?: vscode.TextDocument): vscode.WorkspaceConfiguration {
		if (document) {
			return vscode.workspace.getConfiguration(section, document.uri);
		} else {
			return vscode.workspace.getConfiguration(section);
		}
	}

	/**
	 * getPythonPath
	 *
	 * ReturNs the best retrievable path to the user's Python installation.
	 * Modified from vscode-code-runner to try and extract python path automatically:
	 * https://github.com/formulahendry/vscode-code-runner/blob/2bed9aeeabc1118a5f3d75e47bdbcfaf412765ed/src/utility.ts#L6
	 */
	public static getPythonPath(): string {
		let document = vscode.window.activeTextEditor?.document;

		// First try python extension
		let pyPath = this.getConfiguration("python").pythonPth;
		if (pyPath !== undefined) {
			return pyPath;
		}

		// If path could not be found from extension, try to find it elsewhere. Default to doctestbtn config.
		let defaultPath = vscode.workspace.getConfiguration("doctestbtn").defaultPythonPath;
		try {
			const extension = vscode.extensions.getExtension("ms-python.python");
			// return path from doctestbtn settings if python extension is not present
			if (!extension) {
				// TODO: warn user? give options?
				return defaultPath;
			}
			if (extension.packageJSON?.featureFlags?.usingNewInterpreterStorage) {
				// get from pyton extension
				if (!extension.isActive) {
					extension.activate();
				}
				const pythonPath = extension.exports.settings.getExecutionCommand(document?.uri).join(" ");
				return pythonPath;
			} else {
				// get from python extension settings
				return this.getConfiguration("python").pythonPath;
			}
		} catch (error) {
			return defaultPath;
		}
	}

	public static getDoctestPath(): string {
		return this.getConfiguration("doctestbtn").doctestPath;
	}

	public static getStatusbarPreference(): boolean {
		return this.getConfiguration("doctestbtn").statusBar.showDoctestStatus;
	}

	public static getLinterPreference(): string {
		return this.getConfiguration("doctestbtn").statusBar.lintCondition;
	}
}
