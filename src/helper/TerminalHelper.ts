/**
 * PyDoctestBtn
 * Terminal.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { Logger } from "./Logger";

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
	 * TODO:
	 * - execute a command in the terminal
	 * - execute command in the background? (should this be handled elsewhere?)
	 */

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
}
