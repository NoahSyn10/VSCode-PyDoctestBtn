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
		this.doctestStatus.name = "Doctest Status";
		this.doctestStatus.tooltip = "Run Doctests in Terminal";
		this.doctestStatus.command = "doctestbtn.execDoctest_plain";

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
			//vscode.window.activeTextEditor?.document.fileName!
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

	updateDiagnostics(docUri: vscode.Uri) {
		this.failureCount = this.diagnosticsList.length;
		this.updateStatus();

		log.info(`Updating diagnostics with ${this.diagnosticsList.length} items`);
		this.diagnosticCollection.clear;
		this.diagnosticCollection.set(docUri, this.diagnosticsList);
		this.diagnosticsList = [];
	}

	updateStatus() {
		let doctestCount = DoctestLinterService.countDoctests(vscode.window.activeTextEditor!);
		this.doctestStatus.text = `Doctests: ${doctestCount[0]} `;

		if (this.failureCount === 0) {
			this.doctestStatus.text += `(All Passing)`;
		} else {
			this.doctestStatus.text += `(${doctestCount[0] - this.failureCount} pass / ${this.failureCount} fail)`;
		}
		this.doctestStatus.show();
	}
}
