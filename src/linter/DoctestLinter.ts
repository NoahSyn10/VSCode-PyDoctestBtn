/**
 * PyDoctestBtn
 * DoctestLinter.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

/**
 * DoctestLinter
 */
export class DoctestLinter {
	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	/**
	 * TODO:
	 * - run doctests in background
	 * - parse the errors into objects
	 * - pass the errors to the Diagnostics
	 */
}
