/**
 * PyDoctestBtn
 * Terminal.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { Logger } from "./Logger";
import { exec } from "child_process";

let log: Logger = new Logger("TerminalHelper");

/**
 * TerminalHelper
 */
export class TerminalHelper {
	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	/**
	 * Searches for an open terminal with the given name
	 * @param name Terminal name to search for
	 * @returns The terminal object if found, undefined otherwise
	 */
	public static findTerminal(name: string): vscode.Terminal | undefined {
		const activeTerminals: readonly vscode.Terminal[] = vscode.window.terminals;
		for (const terminal of activeTerminals) {
			if (terminal.name === name) {
				return terminal;
			}
		}
		return undefined;
	}

	/**
	 * Retrieves the active terminal with the highest "priority", creating one if needed.
	 * Priority is determined by terminal name:
	 *  - "Python"
	 *  - "Doctest"
	 *  - Any other open terminal
	 * @returns An active vscode.Terminal object
	 */
	public static getMainTerminal(): vscode.Terminal {
		let pythonTerminal = this.findTerminal("Python");
		let doctestTerminal = this.findTerminal("Doctest");

		if (pythonTerminal) {
			log.info("'Python' terminal found");
			return pythonTerminal;
		} else if (doctestTerminal) {
			log.info("'Doctest' terminal found");
			return doctestTerminal;
		} else if (vscode.window.activeTerminal) {
			log.info("'{}' terminal found", vscode.window.activeTerminal.name);
			return vscode.window.activeTerminal;
		} else {
			log.info("Creating 'Doctest' terminal");
			return vscode.window.createTerminal("Doctest");
		}
	}

	/**
	 * Execute the given command in the given terminal
	 * @param terminal The terminal to execute the command in
	 * @param command The command to execute
	 * @returns A promise that resolves with the command's output
	 */
	public static executeInBackground(command: string): Promise<string> {
		log.info(`Executing command in background: ${command}`);

		return new Promise((resolve, reject) => {
			exec(command, (error, stdout, stderr) => {
				if (error) {
					log.info(`Doctest Failures Found`);
				}
				if (stderr) {
					log.error(`stderr: ${stderr}`);
					reject(new Error(stderr));
				}
				log.info("executeInBackground() successful");
				resolve(stdout);
			});
		});
	}
}