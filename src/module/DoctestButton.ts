/**
 * PyDoctestBtn
 * DoctestButton.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { LoggerHelper } from "../helper/LoggerHelper";
import { TerminalHelper } from "../helper/TerminalHelper";
import { DoctestButtonService } from "../service/DoctestButtonService";

/**
 * Doctest Button
 */
export class DoctestButton {
	context: vscode.ExtensionContext;
	log: vscode.LogOutputChannel;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.log = LoggerHelper.getLogger(context);
	}

	/**
	 * Executes the Doctest command in the 'main' terminal
	 * - Save the active document
	 * - Bring up the main terminal
	 * - Send the Doctest command to the terminal
	 */
	public executeDoctest() {
		let terminal: vscode.Terminal = TerminalHelper.getMainTerminal();
		let pythonPath: string | undefined = this.context.workspaceState.get("PYTHON_PATH");
		if (pythonPath === undefined) {
			vscode.window.showErrorMessage("DoctestBtn Error: No Python path could be found.");
			return;
		}

		let doctestCommand: string = DoctestButtonService.getDoctestCommand(
			pythonPath,
			this.context.workspaceState.get("DOCTEST_PATH")!,
			vscode.window.activeTextEditor?.document.fileName!
		);
		this.log.info("Executing Doctest with command: [{}] in terminal '{}'", doctestCommand, terminal.name);

		vscode.window.activeTextEditor!.document.save();
		terminal.show();
		terminal.sendText(doctestCommand);
	}
}
