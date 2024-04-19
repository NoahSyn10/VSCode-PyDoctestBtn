/**
 * PyDoctestBtn
 * Configuration.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

/**
 * Configuration
 */
export class Configuration {
	context: vscode.ExtensionContext;

	doctestCount: vscode.StatusBarItem;
	doctestStatus: vscode.StatusBarItem;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;

		this.doctestCount = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100.3);
		this.doctestStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100.3);
	}

	/**
	 * Refresh the configuration, pulling changes into the ExtensionContext.workspaceState
	 */
	refresh() {
		/**
		 * TODO:
		 * - get paths (python path, doctest path)
		 * - format doctest comment? (minus file path?)
		 *    - OR keep doctestcommand logic in doctest button code??
		 * - get status bar configuration
		 * - get linter configuration
		 * -
		 *
		 * RELOCATE:
		 * - getting of file path
		 * - show/hide button
		 * - show/hide doctest count statusbar item
		 * - show/hide doctest status statusbar item
		 * - push/update diagnostics
		 */
	}
}
