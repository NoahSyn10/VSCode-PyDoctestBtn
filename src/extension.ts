/**
 * VSCode-PyDoctestBtn
 * extension.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

import { Logger } from "./helper/Logger";
import { Configuration } from "./module/Configuration";
import { DoctestButton } from "./module/DoctestButton";
import { DoctestLinter } from "./module/DoctestLinter";

export function activate(context: vscode.ExtensionContext) {
	// Initialize LogOutputChannel for use by extension
	Logger.initLogChannel("DoctestBtn");
	let log = new Logger("Activate");
	log.info(`\n${"=".repeat(350)}\nActivating PyDoctestBtn\n${"=".repeat(350)}`);

	// Handle Configuration Management
	let config = new Configuration(context);
	config.refreshContext();
	let configListener = vscode.workspace.onDidChangeConfiguration(() => {
		config.refreshContext();
	});
	context.subscriptions.push(configListener);

	// DoctestButton Setup
	let doctestBtn = new DoctestButton(context);
	let plainButton = vscode.commands.registerCommand("doctestbtn.execDoctest_plain", () => doctestBtn.executeDoctest());
	let fancyButton = vscode.commands.registerCommand("doctestbtn.execDoctest_fancy", () => doctestBtn.executeDoctest());
	let xtraFancyButton = vscode.commands.registerCommand("doctestbtn.execDoctest_xtraFancy", () => doctestBtn.executeDoctest());
	context.subscriptions.push(plainButton);
	context.subscriptions.push(fancyButton); // Initialize each button command (one for each 'style')
	context.subscriptions.push(xtraFancyButton);

	// DoctestLinter Setup
	let doctestLinter = new DoctestLinter(context);
	doctestLinter.executeLinter(vscode.window.activeTextEditor?.document!);
	doctestLinter.updateDoctestVisibility(vscode.window.activeTextEditor!);

	let onSaveListener = vscode.workspace.onDidSaveTextDocument((doc: vscode.TextDocument) => doctestLinter.executeLinter(doc));
	let editorSwitchListener = vscode.window.onDidChangeActiveTextEditor((newTextEditor?: vscode.TextEditor) => {
		doctestLinter.executeLinter(newTextEditor?.document!);
		doctestLinter.updateDoctestVisibility(newTextEditor!);
	});
	let onEditListener = vscode.workspace.onDidChangeTextDocument((docChange: vscode.TextDocumentChangeEvent) => {
		doctestLinter.updateDoctestVisibility(vscode.window.activeTextEditor!, docChange);
	});
	context.subscriptions.push(onSaveListener);
	context.subscriptions.push(editorSwitchListener);
	context.subscriptions.push(onEditListener);
}

export function deactivate() {
	/*
		Called upon closure of extension.
	*/
}
