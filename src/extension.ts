// PyDoctestBtn
// © 2021 Noah Synowiec noahsyn1@gmail.com

import { fstat } from 'fs';
import { eventNames } from 'process';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	console.log('DoctestBtn active');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	let plainButton = vscode.commands.registerCommand('doctestbtn.execDoctest_plain', () => doctestExecuter());
	let fancyButton = vscode.commands.registerCommand('doctestbtn.execDoctest_fancy', () => doctestExecuter());		// Initialize each command
	let xtraFancyButton = vscode.commands.registerCommand('doctestbtn.execDoctest_xtraFancy', () => doctestExecuter());

	context.subscriptions.push(plainButton);
	context.subscriptions.push(fancyButton);		// Push each button
	context.subscriptions.push(xtraFancyButton);
	
	let typeListener = vscode.workspace.onDidChangeTextDocument((docChangeEvent: vscode.TextDocumentChangeEvent) => doctestDetector(docChangeEvent));	// Initialize typeListener event

	context.subscriptions.push(typeListener);
}

function doctestDetector(docChangeEvent: vscode.TextDocumentChangeEvent) {
	/*
	Searches for doctests in the open file and counts them if present.
	Returns the number of doctests in the active file.
	*/
	if (docChangeEvent.document === vscode.window.activeTextEditor?.document) {
		const docText = vscode.window.activeTextEditor.document.getText();
		console.log('text:' + docText);

		for(var i = 0; i < docChangeEvent.contentChanges.length; i++) {
			const change = docChangeEvent.contentChanges[i];
			
			
			//for(var s = 0; s < docText.length; s++) {
			//	console.log(docText[s]);
			//}
		}
	}
}

function doctestExecuter() {
	/*
	Brings focus to a terminal with highest 'priority', and creates one if none exists.
	Priority levels by terminal name:
	- 'Python'
	- 'Doctest'
	- Any other open terminal
	*/

	const terminals = vscode.window.terminals;							// Get list of active terminals

	if (findTerminal("Python") > -1) {									// If a "Python" terminal exists:
		const pyTerminal = terminals[findTerminal("Python")];			// Get index
		pyTerminal.show();												// Force show to user
		execDoctest(pyTerminal);										// Execute doctest

	} else if (findTerminal("Doctest") > -1) {							// Next check for "Doctest" terminal
		const docTerminal = terminals[findTerminal("Doctest")];    	 	// If exists: get index
		docTerminal.show();												// Force show to user
		execDoctest(docTerminal);										// Execute doctest

	} else if (vscode.window.activeTerminal) {							// If neither exists check for any active terminal
		const activeTerminal = vscode.window.activeTerminal;			// If one is running:
		activeTerminal.show();											// Force show to user
		execDoctest(activeTerminal);									// Execute doctest

	} else {															// If no active terminal exists:
		const docTerminal = vscode.window.createTerminal(`Doctest`);	// Open "Doctest" terminal
		docTerminal.show();												// Force show to user
		execDoctest(docTerminal);										// Execute doctest
	}

}

function findTerminal(termName: String): number {
	/*
	Searches for an open terminal with the given 'termName' as its name.
	Returns the index of the terminal if found, -1 otherwise.
	*/

	const terminals = vscode.window.terminals;			// Get list of active terminals
	for (let i = 0; i < terminals.length; i++) {
		if (terminals[i].name === termName) {			// Check each list for provided name
			return i;									// Return index if found
		}
	}
	return -1;											// Return -1 otherwise
}

function execDoctest(terminal: vscode.Terminal) {
	/*
	'terminal' is a vscode terminal object.
	Runs a doctest inside of the provided terminal object.
	*/

	if (vscode.window.activeTextEditor) {
		const pythonPath = vscode.workspace.getConfiguration('python').pythonPath;				// Retrieve path for python executable
		const doctestPath = vscode.workspace.getConfiguration('doctestbtn').doctestPath;															// Retrieve path for the doctest module
		const filePath = vscode.window.activeTextEditor.document.fileName;						// Retrieve path of current tile (to be doctested)

		const doctestCommand = "& " + pythonPath + " -m " + doctestPath + " -v " + filePath;	// Format the doctest command to be run

		console.log("Running doctest");
		console.log("Python path: '" + pythonPath + "'");
		console.log("Doctest path: '" + doctestPath + "'");
		console.log("File path: '" + filePath + "'");
		console.log("Formatted command: \n'" + doctestCommand + "'\n");

		vscode.window.activeTextEditor.document.save();		// Save document before doctest is run
		terminal.sendText(doctestCommand);					// Send command to the terminal
	} else {
		vscode.window.showErrorMessage("DoctestBtn Error: 'No active text editor'");
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }

