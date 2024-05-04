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
}
