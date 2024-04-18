/**
 * PyDoctestBtn
 * DoctestBtn Class
 * © 2021 Noah Synowiec - noahsyn1@gmail.com
 */

import { exec } from "child_process";
import { ConfigHandler } from "./Handlers";
import { TerminalHandler } from "./Handlers";
import { Parser } from "./Parser";
import { Utils } from "./Utils";
import * as vscode from "vscode";

export class DoctestBtn {
	/*
        A class containing methods that are triggered by the extension's event listeners.
        This class combines the functionality of all other classes to make the DoctestBtn extension.
    */

	config;
	parser;
	terminalHandler;
	utils;

	dtCountEnabled;
	dtStatusEnabled;
	showStatusBarItems;

	constructor() {
		this.config = new ConfigHandler();
		this.parser = new Parser();
		this.terminalHandler = new TerminalHandler();
		this.utils = new Utils();

		this.dtCountEnabled = new Boolean();
		this.dtStatusEnabled = new Boolean();
		this.showStatusBarItems = new Boolean();
	}

	execDoctest() {
		/*
            Excecutes the doctest command in the main terminal.
            Force-shows the terminal if it is hidden.
        */
		let terminal = this.terminalHandler.getMainTerminal(); // Retreive 'main' terminal.
		let doctestCommand = this.config.getDoctestCommand(); // Retreive formatted doctest command.
		terminal.show(); // Force show terminal.
		this.terminalHandler.executeInTerminal(terminal, doctestCommand); // Execute the command in terminal.

		this.utils.dualLog("> Executing Doctest...");
	}

	updateAll(activeEditor: vscode.TextEditor | undefined) {
		this.linter();
		this.doctestHandler(activeEditor);
	}

	hideAll() {
		/*
            Hide all workspace related items.
        */
		this.config.hideDoctestBtn();
		this.config.hideDoctestCount();
		this.config.hideDoctestStatus();
	}

	doctestHandler(activeEditor: vscode.TextEditor | undefined, docChange?: vscode.TextDocumentChangeEvent): void {
		/*
            Get data on doctests in file and update menu and status bar accordingly.
        */
		if (docChange && docChange?.document.fileName !== activeEditor?.document.fileName) {
			return; // Check if change was in the active editor.
		} else if (vscode.window.activeTextEditor?.document.languageId !== "python") {
			this.hideAll(); // Check if active file is a .py file.
			return;
		} else if (activeEditor?.document.languageId !== "python") {
			return; // Check if changed file is a .py file.
		}

		this.utils.dualLog("> Scanning file for doctests...");

		this.parser.countDoctests(activeEditor, (totalDoctests, totalDocstrings) => {
			if (totalDoctests > 0) {
				this.utils.dualLog("> " + totalDoctests + " doctests found."); // If there are doctests, show button and status bar items.
				this.config.showDoctestBtn();
				if (this.dtCountEnabled) {
					this.config.showDoctestCount(totalDoctests);
					this.showStatusBarItems = true;
				}
			} else {
				// If there are none, hide the button and status bar items.
				this.utils.dualLog("> No doctests found.");
				this.hideAll();
				this.showStatusBarItems = false;
			}
		});
	}

	linter() {
		const execCommand = this.config.getDoctestCommand(false); // Get non-verbose doctest command.

		exec(execCommand, (err, result) => {
			// Excecute doctest and receive result.
			if (err) {
				console.log("exec err: " + err);
			}

			this.parser.doctestLinter(result, (failures?) => {
				// Pass result to the doctest linter.
				if (!vscode.window.activeTextEditor) {
					return;
				}
				let docUri = vscode.window.activeTextEditor.document.uri;

				if (!failures) {
					if (this.showStatusBarItems && this.dtStatusEnabled) {
						// Passes and updates if no failures are returned.
						this.config.showDoctestStatus("passing");
					}
					this.config.updateDiagnostics(docUri);
				} else {
					// Displays and pushes failures otherwise.
					if (this.showStatusBarItems && this.dtStatusEnabled) {
						this.config.showDoctestStatus(failures.length + " failures");
					}
					failures.forEach((failure) => {
						// Push each failure to the diagnostics queue.
						const numPushed = this.config.pushDiagnostic(failure.range, failure.errorMsg);
						if (failures.length === numPushed) {
							this.config.updateDiagnostics(docUri); // Update diagnostics when all failures pushed.
						}
					});
				}
			});
		});
	}
}
