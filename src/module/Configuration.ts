/**
 * VSCode-PyDoctestBtn
 * Configuration.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { ConfigurationService } from "../service/ConfigurationService";

/**
 * Configuration
 */
export class Configuration {
	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	/**
	 * refreshContext()
	 *
	 * Refresh the extension context, pulling current preferences into the ExtensionContext.workspaceState.
	 */
	public refreshContext() {
		let workspaceState = this.context.workspaceState;

		// Preferences
		workspaceState.update("PYTHON_PATH", ConfigurationService.getPythonPath());
		workspaceState.update("DOCTEST_PATH", ConfigurationService.getDoctestPath());
		workspaceState.update("STATUSBAR_PREFERENCE", ConfigurationService.getStatusbarPreference());
		workspaceState.update("LINTER_PREFERENCE", ConfigurationService.getLinterPreference());

		// Diagnostics Collection
		workspaceState.update("DIAGNOSTICS_COLLECTION", vscode.languages.createDiagnosticCollection("doctest"));

		// Statusbar Item
		let doctestStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100.3);
		doctestStatus.name = "Doctest Status";
		doctestStatus.tooltip = "Run Doctests in Terminal";
		doctestStatus.command = "doctestbtn.execDoctest_plain";
		workspaceState.update("DOCTEST_STATUS", doctestStatus);

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
