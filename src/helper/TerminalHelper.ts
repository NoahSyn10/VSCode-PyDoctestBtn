/**
 * PyDoctestBtn
 * Terminal.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { LoggerHelper } from "./LoggerHelper";

/**
 * Terminal
 */
export class TerminalHelper {
	context: vscode.ExtensionContext;
	log: vscode.LogOutputChannel;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.log = LoggerHelper.getLogger(context);
	}

	/**
	 * TODO:
	 * - execute a command in the terminal
	 * - execute command in the background? (should this be handled elsewhere?)
	 */

	/**
	 * Searches for an open terminal with the given name
	 * @param name Terminal name to search for
	 * @returns The terminal object if found, undefined otherwise
	 */
	public static findTerminal(name: String): vscode.Terminal | undefined {
		const activeTerminals: readonly vscode.Terminal[] = vscode.window.terminals;
		for (let i = 0; i < activeTerminals.length; i++) {
			if (activeTerminals[i].name === name) {
				return activeTerminals[i];
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
			//this.log.info("'Python' terminal found");
			return pythonTerminal;
		} else if (doctestTerminal) {
			//this.log.info("'Doctest' terminal found");
			return doctestTerminal;
		} else if (vscode.window.activeTerminal) {
			//this.log.info("'{}' terminal found", vscode.window.activeTerminal.name);
			return vscode.window.activeTerminal;
		} else {
			//this.log.info("Creating 'Doctest' terminal");
			return vscode.window.createTerminal("Doctest");
		}
	}
}
