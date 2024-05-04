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

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.diagnosticsList = [];
		//this.diagnosticCollection = this.context.workspaceState.get("diagnosticCollection")!;
		this.diagnosticCollection = vscode.languages.createDiagnosticCollection("doctest");
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

		doctestFailures.forEach((failure) => {
			const numPushed = this.pushDiagnostic(failure.range, failure.errorMessage, vscode.DiagnosticSeverity.Warning);
			if (numPushed === doctestFailures.length) {
				this.updateDiagnostics(textDoc.uri);
			}
		});
	}

	pushDiagnostic(range: vscode.Range, message: string, severity: vscode.DiagnosticSeverity): number {
		this.diagnosticsList.push(new vscode.Diagnostic(range, message, severity));
		return this.diagnosticsList.length;
	}

	updateDiagnostics(docUri: vscode.Uri) {
		log.info(`Updating diagnostics with ${this.diagnosticsList.length} items`);
		this.diagnosticCollection.clear;
		this.diagnosticCollection.set(docUri, this.diagnosticsList);
		this.diagnosticsList = [];
	}
}
