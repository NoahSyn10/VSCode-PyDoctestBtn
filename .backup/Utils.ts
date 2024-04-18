/*
    PyDoctestBtn
    Utils Class
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/

import * as vscode from "vscode";

export class Utils {
	/*
        A class containing simple utility methods for ease of use.
    */

	extOutput;

	constructor() {
		this.extOutput = vscode.window.createOutputChannel("DoctestBtn");
	}

	dualLog(text: string): void {
		/*
            Logs the given text in both the console and the extension's output window.
        */
		console.log(text);
		this.extOutput.appendLine(text);
	}

	failureCallback(diag?: DoctestFailure[]) {}

	singleNumCallback(output1: number) {}

	doubleNumCallback(output1: number, output2: number) {}
}

export class DoctestFailure {
	/*
        A class that encapsulates an error returned from doctest output.
    */

	rawText;
	failTextList;
	lineNum;
	range;
	errorMsg;

	constructor(failure: string, doc: vscode.TextDocument) {
		this.rawText = failure;
		this.failTextList = failure.split("\n").slice(1, -1);

		// Get range.
		this.lineNum = parseInt(this.failTextList[0].split(", ")[1].slice(5)) - 1; // -1 accounts for indexing.
		this.range = new vscode.Range(
			this.lineNum,
			doc.lineAt(this.lineNum).firstNonWhitespaceCharacterIndex,
			this.lineNum,
			doc?.lineAt(this.lineNum).text.length
		);

		// Get error message.
		this.errorMsg = "Error message not available"; // In case an errorMsg is (somehow) not found.
		if (this.failTextList.length === 7) {
			this.errorMsg = "Expected: " + this.failTextList[4].trim() + "\nGot: " + this.failTextList[6].trim();
		} else if (this.failTextList.length === 6) {
			this.errorMsg = "Expected: " + this.failTextList[4].trim() + "\n" + this.failTextList[5].trim();
		} else {
			this.errorMsg = this.failTextList[this.failTextList.length - 1].trim();
		}
	}
}
