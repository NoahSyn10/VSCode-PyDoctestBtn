/**
 * PyDoctestBtn
 * DoctestButton.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

/**
 * Doctest Button
 */
export class DoctestButton {
	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	/**
	 * Execute the doctest commant in the main terminal
	 * Bring up the terminal if neccessary
	 */
	runDoctest() {}
}
