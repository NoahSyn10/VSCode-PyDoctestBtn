/**
 * PyDoctestBtn
 * DoctestButtonService.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { LoggerHelper } from "../helper/LoggerHelper";

/**
 * Doctest Button Service
 */
export class DoctestButtonService {
	context: vscode.ExtensionContext;
	log: vscode.LogOutputChannel;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.log = LoggerHelper.getLogger(context);
	}

	public static getDoctestCommand(pythonPath: string, doctestPath: string, filePath: string, verbose: boolean = true): string {
		let v = " -v "; // default to verbose
		if (verbose === false) {
			v = " ";
		}

		let doctestCommand = pythonPath + " -m " + doctestPath + v + '"' + filePath + '"';
		// TODO: this.log.info("Doctest Command Generated: {}", doctestCommand);
		return doctestCommand;
	}
}
