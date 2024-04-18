/**
 * PyDoctestBtn
 * Terminal.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

/**
 * Terminal
 */
export class Terminal {
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
	 * Execute the provided command in the appropriate terminal window
	 * @param command
	 */
	execute(command: string) {}
}
