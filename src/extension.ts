// PyDoctestBtn
// © 2021 Noah Synowiec noahsyn1@gmail.com

import { fstat } from 'fs';
import { eventNames } from 'process';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time an activationEvent is triggered
export function activate(context: vscode.ExtensionContext) {

	// This block of code will only be executed once when your extension is activated

	console.log('DoctestBtn active');
	doctestHandler(vscode.window.activeTextEditor);	// Count doctests on activation.

	let plainButton = vscode.commands.registerCommand('doctestbtn.execDoctest_plain', () => doctestExecuter());
	let fancyButton = vscode.commands.registerCommand('doctestbtn.execDoctest_fancy', () => doctestExecuter());		// Initialize each command
	let xtraFancyButton = vscode.commands.registerCommand('doctestbtn.execDoctest_xtraFancy', () => doctestExecuter());

	context.subscriptions.push(plainButton);
	context.subscriptions.push(fancyButton);		// Push each button
	context.subscriptions.push(xtraFancyButton);
	
	let docEditListener = vscode.workspace.onDidChangeTextDocument(() => doctestHandler(vscode.window.activeTextEditor));	
	context.subscriptions.push(docEditListener);		// Listen for edits to active doc.

	let editorSwitchListener = vscode.window.onDidChangeActiveTextEditor((newTextEditor?: vscode.TextEditor) => doctestHandler(newTextEditor));
	context.subscriptions.push(editorSwitchListener);	// Listen for change of active doc.

	
	/*
	var showBtn = vscode.workspace.getConfiguration('doctestbtn').showButton;
	console.log('Show Button: ' + showBtn);
			
	vscode.workspace.getConfiguration("doctestbtn").update("showButton", true);
	*/
}

function doctestHandler(activeEditor: vscode.TextEditor | undefined) {
	/*
	Get data on doctests in file and update menu and status bar accordingly
	*/
	const docData = doctestDetector(activeEditor);

	if (docData.totalDoctests > 0) {
		vscode.workspace.getConfiguration("doctestbtn").update("showButton", true);
	} else {
		vscode.workspace.getConfiguration("doctestbtn").update("showButton", false);
	}
}

function doctestDetector(activeEditor: vscode.TextEditor | undefined) {
	/*
	Searches the active document for valid doctests.
	Returns the number of valid docstrings and doctests in the active file.
	*/
	var tripleDoubleQuotes = 0; 
	var tripleSingleQuotes = 0; 
	var totalDocstrings = 0;
	var totaldocTests = 0;

	if (activeEditor?.document.languageId === "python") {
		const doc = activeEditor.document;

		for (var i = 0; i < doc.lineCount; i++) {						// Iterate through each line of text in the active doc
			const line = doc.lineAt(i);		

			if (!line.isEmptyOrWhitespace) {												// Ignore if whitespace
				const txtIndex = line.firstNonWhitespaceCharacterIndex;	
				const text = line.text.slice(txtIndex);										// Ignore whitespace up to first character

				if (text.slice(0,3) === '"""' && tripleSingleQuotes % 2 === 0) {			// Count """ if not in ''' docstring
					tripleDoubleQuotes++;

				} else if (text.slice(0,3) === "'''" && tripleDoubleQuotes % 2 === 0) {		// Count ''' if not in """ docstring
					tripleSingleQuotes++;

				} else if (text.slice(0, 4) === ">>> " && text.trim().length > 4 && 		// Count >>> if followed by a space and a 
						  (tripleSingleQuotes % 2 === 1 || tripleDoubleQuotes % 2 === 1)) {	// character and inside a """ or ''' docstring.
					totaldocTests++;														
				}
			}
		}
		totalDocstrings = ~~(tripleDoubleQuotes / 2) + ~~(tripleSingleQuotes / 2);	// Total docstrings = sum of floor division of total ''' and """ instances
	}
	return {
		"totalDocstrings": totalDocstrings,
		"totalDoctests": totaldocTests
	};
}

function doctestExecuter() {
	/*
	Brings focus to a terminal with highest 'priority', and creates one if none exists.
	Executes doctest in active terminal using execDoctest().
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

