/**
 * PyDoctestBtn
 * DoctestButtonService.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { Logger } from "../helper/Logger";

let log: Logger = new Logger("DoctestButtonService");

/**
 * Doctest Button Service
 */
export class DoctestButtonService {
	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	public static getDoctestCommand(pythonPath: string, doctestPath: string, filePath: string, verbose: boolean = true): string {
		let v = " -v "; // default to verbose
		if (verbose === false) {
			v = " ";
		}

		let doctestCommand = pythonPath + " -m " + doctestPath + v + '"' + filePath + '"';
		log.debug(`Doctest Command Generated: [${doctestCommand}]`);
		return doctestCommand;
	}
}
