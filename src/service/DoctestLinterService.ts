/**
 * PyDoctestBtn
 * DoctestLinter.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { Logger } from "../helper/Logger";
import { DoctestFailure } from "../models/DoctestFailure";
import { DoctestHelper } from "../helper/DoctestHelper";

let log: Logger = new Logger("DoctestLinterService");

/**
 * DoctestLinterService
 */
export class DoctestLinterService {
	/**
	 * Parse the output of a Doctest execution, turning each failed Doctest into a DoctestFailure object.
	 * @param output
	 * @returns A list of DoctestFailure objects
	 */
	public static parseDoctestOutput(output: string, textDoc: vscode.TextDocument): DoctestFailure[] {
		let failures: DoctestFailure[] = [];

		if (!vscode.window.activeTextEditor) {
			log.info("No active text editor found.");
			return failures;
		}
		if (output === "") {
			log.info("Doctest output is empty, no failures to parse");
			return failures;
		}

		let outputBlocks = output.split("*".repeat(70)).slice(1, -1); // Slice off leading '\n' and trailing summary.

		for (let block of outputBlocks) {
			if (block) {
				let failure = new DoctestFailure(block, textDoc);
				failures.push(failure);
			}
		}

		log.info(`Parsed ${failures.length} Doctest failures`);

		return failures;
	}

	public static getDiagnostic(range: vscode.Range, message: string, severity: vscode.DiagnosticSeverity): vscode.Diagnostic {
		let diagnostic = new vscode.Diagnostic(range, message, severity);
		diagnostic.source = "DoctestBtn";
		return diagnostic;
	}

	public static countDoctests(textEditor: vscode.TextEditor): number[] {
		/*
            Searches the given document for valid doctests.
            Returns the number of valid docstrings and doctests in the active file.
        */
		var tripleDoubleQuotes = 0;
		var tripleSingleQuotes = 0;
		var totalDocstrings = 0;
		var totalDoctests = 0;

		const doc = textEditor.document;

		for (var i = 0; i < doc.lineCount; i++) {
			// Iterate through each line of text in the active doc
			const line = doc.lineAt(i);

			if (!line.isEmptyOrWhitespace) {
				// Ignore if whitespace
				const txtIndex = line.firstNonWhitespaceCharacterIndex;
				const text = line.text.slice(txtIndex); // Ignore whitespace up to first character

				if (text.slice(0, 3) === '"""' && tripleSingleQuotes % 2 === 0) {
					// Count """ if not in ''' docstring
					tripleDoubleQuotes++;
				} else if (text.slice(0, 3) === "'''" && tripleDoubleQuotes % 2 === 0) {
					// Count ''' if not in """ docstring
					tripleSingleQuotes++;
				} else if (
					text.slice(0, 4) === ">>> " &&
					text.trim().length > 4 && // Count >>> if followed by a space and a
					(tripleSingleQuotes % 2 === 1 || tripleDoubleQuotes % 2 === 1)
				) {
					// character and inside a """ or ''' docstring.
					totalDoctests++;
				}
			}
		}

		// Total docstrings = sum of floor division of total ''' and """ instances
		totalDocstrings = ~~(tripleDoubleQuotes / 2) + ~~(tripleSingleQuotes / 2);

		log.info(`Found ${totalDoctests} Doctests, ${totalDocstrings} Docstrings`);

		return [totalDoctests, totalDocstrings];
	}
}
