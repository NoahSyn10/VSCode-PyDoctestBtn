/**
 * VSCode-PyDoctestBtn
 * ConfigurationService.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { Logger } from "../helper/Logger";

let log: Logger = new Logger("ConfigurationService");

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

		// If path could not be found from extension, try to find it elsewhere. Default to doctestbtn config.
		let defaultPath = vscode.workspace.getConfiguration("doctestbtn").defaultPythonPath;
		try {
			const extension = vscode.extensions.getExtension("ms-python.python");
			// return path from doctestbtn settings if python extension is not present
			if (!extension) {
				// TODO: warn user? give options?
				log.info(`Default Python path [${defaultPath}] from DoctestBtn extension used`);
				return defaultPath;
			}
			if (extension.packageJSON?.featureFlags?.usingNewInterpreterStorage) {
				// get from pyton extension
				if (!extension.isActive) {
					extension.activate();
				}
				const pythonPath = extension.exports.settings.getExecutionCommand(document?.uri).join(" ");
				log.info(`Python path [${pythonPath}] retrieved from the ms-python.python extension`);
				return pythonPath;
			} else {
				// get from python extension settings
				let pyPath = this.getConfiguration("python").pythonPath;
				log.info(`Python path [${pyPath}] retrieved from the Python extension`);
				return pyPath;
			}
		} catch (error) {
			log.info(`Default Python path [${defaultPath}] from DoctestBtn extension used`);
			return defaultPath;
		}
	}

	public static getDoctestPath(): string {
		let dtPath = this.getConfiguration("doctestbtn").doctestPath;
		log.info(`Doctest Path: [${dtPath}]`);
		return dtPath;
	}

	public static getStatusbarPreference(): boolean {
		let sbPreference = this.getConfiguration("doctestbtn").statusBar.showDoctestStatus;
		log.info(`Show StatusBar: [${sbPreference}]`);
		return sbPreference;
	}

	public static getLinterPreference(): string {
		let lntPreference = this.getConfiguration("doctestbtn").statusBar.lintCondition;
		log.info(`Lint Condition: [${lntPreference}]`);
		return lntPreference;
	}
}
