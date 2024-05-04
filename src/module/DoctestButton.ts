/**
 * PyDoctestBtn
 * DoctestButton.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { Logger } from "../helper/Logger";
import { TerminalHelper } from "../helper/TerminalHelper";
import { DoctestHelper } from "../helper/DoctestHelper";

let log: Logger = new Logger("DoctestButton");

/**
 * Doctest Button
 */
export class DoctestButton {
	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	/**
	 * Executes the Doctest command in the 'main' terminal
	 * - Save the active document
	 * - Bring up the main terminal
	 * - Send the Doctest command to the terminal
	 */
	public executeDoctest() {
		log.info(`Doctest Button pressed for file: ['${vscode.window.activeTextEditor?.document.fileName!}']`);

		let terminal: vscode.Terminal = TerminalHelper.getMainTerminal();
		let pythonPath: string | undefined = this.context.workspaceState.get("PYTHON_PATH");
		if (pythonPath === undefined) {
			vscode.window.showErrorMessage("DoctestBtn Error: No Python path could be found.");
			return;
		}

		const doctestCommand: string = DoctestHelper.getDoctestCommand(
			pythonPath,
			this.context.workspaceState.get("DOCTEST_PATH")!,
			vscode.window.activeTextEditor?.document.fileName!
		);
		log.info(`Executing Doctest with command: [${doctestCommand}] in terminal '${terminal.name}'`);

		vscode.window.activeTextEditor!.document.save();
		terminal.show();
		terminal.sendText(doctestCommand);
	}
}
