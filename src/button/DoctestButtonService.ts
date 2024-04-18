/**
 * PyDoctestBtn
 * DoctestButtonService.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

/**
 * Doctest Button Service
 */
export class DoctestButtonService {
	context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}
}
