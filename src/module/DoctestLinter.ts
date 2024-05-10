/**
 * PyDoctestBtn
 * DoctestLinter.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { Logger } from "../helper/Logger";
import { DoctestFailure } from "../models/DoctestFailure";
import { DoctestHelper } from "../helper/DoctestHelper";
import { DoctestLinterService } from "../service/DoctestLinterService";
import { TerminalHelper } from "../helper/TerminalHelper";

let log: Logger = new Logger("DoctestLinter");

/**
 * DoctestLinter
 */
export class DoctestLinter {
	context: vscode.ExtensionContext;
	diagnosticsList: vscode.Diagnostic[];
	diagnosticCollection: vscode.DiagnosticCollection;
	doctestStatus: vscode.StatusBarItem;
	failureCount: number = 0;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.diagnosticsList = [];
		this.diagnosticCollection = this.context.workspaceState.get("DIAGNOSTICS_COLLECTION")!;
		this.doctestStatus = this.context.workspaceState.get("DOCTEST_STATUS")!;

		// TODO: make status go away when not in python editor
	}

	/**
	 * TODO:
	 * - run doctests in background
	 * - parse the errors into objects
	 * - pass the errors to the Diagnostics
	 */

	async executeLinter(textDoc: vscode.TextDocument) {
		const doctestCommand = DoctestHelper.getDoctestCommand(
			this.context.workspaceState.get("PYTHON_PATH")!,
			this.context.workspaceState.get("DOCTEST_PATH")!,
			textDoc.fileName,
			false
		);

		log.info(`Executing Doctest Linter...`);

		let doctestOutput: string = await TerminalHelper.executeInBackground(doctestCommand);
		let doctestFailures: DoctestFailure[] = DoctestLinterService.parseDoctestOutput(doctestOutput, textDoc);

		if (doctestFailures.length === 0) {
			this.updateDiagnostics(textDoc.uri);
		}

		doctestFailures.forEach((failure) => {
			this.diagnosticsList.push(
				DoctestLinterService.getDiagnostic(failure.range, failure.errorMessage, vscode.DiagnosticSeverity.Warning)
			);
			if (this.diagnosticsList.length === doctestFailures.length) {
				this.updateDiagnostics(textDoc.uri);
			}
		});
	}

	/**
	 * Update the Diagnostics Collection with the contents of the Diagnostics List, and reset the list
	 * @param docUri
	 */
	updateDiagnostics(docUri: vscode.Uri) {
		this.failureCount = this.diagnosticsList.length;
		this.updateStatus();

		log.info(`Updating diagnostics with ${this.diagnosticsList.length} items`);
		this.diagnosticCollection.clear();
		this.diagnosticCollection.set(docUri, this.diagnosticsList);
		this.diagnosticsList = [];
	}

	/**
	 * Update the Doctest Statusbar item with the current doctest count and the pass/fail count
	 */
	updateStatus() {
		let doctestCount = DoctestLinterService.countDoctests(vscode.window.activeTextEditor!);
		this.doctestStatus.text = `Doctests: ${doctestCount[0]} `;

		let passingCount = doctestCount[0] - this.failureCount;

		log.info(`Updating statusbar for ${doctestCount[0]} doctests with ${passingCount} passing and ${this.failureCount} failing`);
		if (this.failureCount === 0) {
			this.doctestStatus.text += `(All Passing)`;
		} else {
			this.doctestStatus.text += `(${passingCount} pass / ${this.failureCount} fail)`;
		}
	}

	/**
	 * Determine whether the doctest button and statusbar item should be shown, and handle accordingly
	 */
	updateDoctestVisibility(textEditor: vscode.TextEditor, docChange?: vscode.TextDocumentChangeEvent) {
		if (docChange && (docChange.document.languageId !== "python" || docChange.document.fileName !== textEditor.document.fileName)) {
			return; // Check if change was in active python editor.
		}

		let doctestCount = DoctestLinterService.countDoctests(textEditor);

		if (textEditor.document.languageId !== "python" || doctestCount[0] === 0) {
			DoctestLinterService.hideDoctestBtn();
			this.doctestStatus.hide();
		} else {
			DoctestLinterService.showDoctestBtn();
			this.doctestStatus.show();
		}
	}
}
