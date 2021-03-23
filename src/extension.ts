/*
	PyDoctestBtn
	© 2021 Noah Synowiec - noahsyn1@gmail.com
*/	

import { fstat } from 'fs';
import { eventNames, stderr } from 'process';
import { exec } from 'child_process';
import * as vscode from 'vscode';

import { DoctestBtn } from './DoctestBtn';

let doctestStatus: vscode.StatusBarItem;	
let docstringStatus: vscode.StatusBarItem;		// Objects that need to be global
let extOutput: vscode.OutputChannel;

let doctestBtn: DoctestBtn;

export function activate(context: vscode.ExtensionContext) {
	/*
		Called once upon activation of extension.
		Initializes elements and listeners.
	*/
	extOutput = vscode.window.createOutputChannel("DoctestBtn");	// Initialize output channel

	doctestBtn = new DoctestBtn;

	console.log('> DoctestBtn active');
	extOutput.appendLine("> DoctestBtn active");

	let plainButton = vscode.commands.registerCommand('doctestbtn.execDoctest_plain', () => doctestBtn.execDoctest());
	let fancyButton = vscode.commands.registerCommand('doctestbtn.execDoctest_fancy', () => doctestBtn.execDoctest());		
	let xtraFancyButton = vscode.commands.registerCommand('doctestbtn.execDoctest_xtraFancy', () => doctestBtn.execDoctest());
	context.subscriptions.push(plainButton);
	context.subscriptions.push(fancyButton);			// Initialize each button command (one for each 'style')
	context.subscriptions.push(xtraFancyButton);
	
	let docEditListener = vscode.workspace.onDidChangeTextDocument((docChange: vscode.TextDocumentChangeEvent) => doctestBtn.doctestHandler(vscode.window.activeTextEditor, docChange));	
	let editorSwitchListener = vscode.window.onDidChangeActiveTextEditor((newTextEditor?: vscode.TextEditor) => doctestBtn.doctestHandler(newTextEditor));
	let saveListener = vscode.workspace.onDidSaveTextDocument((savedDoc: vscode.TextDocument) => doctestBtn.linter(savedDoc));
	context.subscriptions.push(docEditListener);		// Listen for edits to active doc.
	context.subscriptions.push(editorSwitchListener);	// Listen for change of active doc.
	context.subscriptions.push(saveListener);			// Listen for save of active doc.

	doctestBtn.doctestHandler(vscode.window.activeTextEditor);		// Count doctests on activation.
}

export function deactivate() {
	/*
		Called upon closure of extension.
	*/
}