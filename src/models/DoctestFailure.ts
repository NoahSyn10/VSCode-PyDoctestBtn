/**
 * PyDoctestBtn
 * DoctestFailure.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

/**
 * DoctestFailure
 *
 * Encapsulates a failed Doctest, storing the information needed to create a Diagnostic object.
 */
export class DoctestFailure {
	failureText: string[] = [];
	lineNumber: number = -1;
	range: vscode.Range = new vscode.Range(0, 0, 0, 0);
	errorMessage: string = "";

	constructor(failure: string, doc: vscode.TextDocument) {
		this.failureText = failure.split("\n").slice(1, -1);
		if (this.failureText.length < 4) {
			return;
		}

		// Get error message.
		if (this.failureText.length === 7) {
			this.errorMessage += "Expected: " + this.failureText[4].trim() + "\nGot: " + this.failureText[6].trim();
		} else if (this.failureText.length === 6) {
			this.errorMessage += "Expected: " + this.failureText[4].trim() + "\n" + this.failureText[5].trim();
		} else {
			this.errorMessage += this.failureText[this.failureText.length - 1].trim();
		}

		// Get range.
		this.lineNumber = parseInt(this.failureText[0].split(", ")[1].slice(5)) - 1; // -1 accounts for indexing.
		this.range = new vscode.Range(
			this.lineNumber,
			doc.lineAt(this.lineNumber).firstNonWhitespaceCharacterIndex,
			this.lineNumber,
			doc?.lineAt(this.lineNumber).text.length
		);
	}
}
