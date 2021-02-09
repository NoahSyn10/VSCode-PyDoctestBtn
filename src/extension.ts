// PyDoctestBtn
// © 2021 Noah Synowiec noahsyn1@gmail.com

import { fstat } from 'fs';
import { eventNames, stderr } from 'process';
import { exec } from 'child_process';
import * as vscode from 'vscode';

let doctestStatus: vscode.StatusBarItem;	
let docstringStatus: vscode.StatusBarItem;		// Objects that need to be global
let extOutput: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
	/*
	Called once upon activation of extension.
	Initializes elements and listeners.
	*/
	extOutput = vscode.window.createOutputChannel("DoctestBtn");	// Initialize output channel

	console.log('DoctestBtn active/n');
	extOutput.appendLine("> DoctestBtn active");

	let plainButton = vscode.commands.registerCommand('doctestbtn.execDoctest_plain', () => doctestExecuter());
	let fancyButton = vscode.commands.registerCommand('doctestbtn.execDoctest_fancy', () => doctestExecuter());		
	let xtraFancyButton = vscode.commands.registerCommand('doctestbtn.execDoctest_xtraFancy', () => doctestExecuter());
	context.subscriptions.push(plainButton);
	context.subscriptions.push(fancyButton);			// Initialize each button command (one for each 'style')
	context.subscriptions.push(xtraFancyButton);
	
	let docEditListener = vscode.workspace.onDidChangeTextDocument((docChange: vscode.TextDocumentChangeEvent) => doctestHandler(vscode.window.activeTextEditor, docChange));	
	let editorSwitchListener = vscode.window.onDidChangeActiveTextEditor((newTextEditor?: vscode.TextEditor) => doctestHandler(newTextEditor));
	context.subscriptions.push(docEditListener);		// Listen for edits to active doc.
	context.subscriptions.push(editorSwitchListener);	// Listen for change of active doc.

	let saveListener = vscode.workspace.onDidSaveTextDocument((savedDoc: vscode.TextDocument) => doctestLinter(savedDoc));
	context.subscriptions.push(saveListener);

	doctestStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100.3);	
	docstringStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);	
	context.subscriptions.push(doctestStatus);			// Create doctest counter status bar item
	context.subscriptions.push(docstringStatus);		// Create docstring counter status bar item

	doctestHandler(vscode.window.activeTextEditor);		// Count doctests on activation.


}

function doctestLinter(activeEditor: vscode.TextDocument) {
	/*
	Executes doctest silently and parses output.
	*/
	const paths = getPaths();
	const execCommand = paths.python + " -m " + paths.doctest + " -v " + paths.file;
	var failed = false;

	exec(execCommand, (err, stdout, stderr) => {
		if (err) {
			console.log("Error: err tripped");
		}
	  
		// the *entire* stdout and stderr (buffered)
		const summary = stdout.split('\n').slice(-6,-1);
		for (var i = 0; i < summary.length; i++) {
			console.log(summary[i]);
		}

		if (summary[4][1] === '*') {
			failed = true;
		}
	});
}

function doctestHandler(activeEditor: vscode.TextEditor | undefined, docChange?: vscode.TextDocumentChangeEvent): void {
	/*
	Get data on doctests in file and update menu and status bar accordingly
	*/
	if ((docChange && docChange?.document.fileName !== activeEditor?.document.fileName) || activeEditor?.document.languageId !== "python") {
		return;																				// Check if change was in the active editor & if the editor is a .py file
	}
		
	extOutput.appendLine("> Scanning file for doctests...");
	
	const docData = doctestDetector(activeEditor);

	if (docData?.totalDoctests > 0) {														// If there are doctests, show button and status bar items.
		extOutput.appendLine("> " + docData.totalDoctests + " doctests found");
															
		vscode.workspace.getConfiguration("doctestbtn").update("showButton", true);
		doctestStatus.text = "Doctests: " + docData.totalDoctests;
		doctestStatus.show();

	} else {																				// If there are none, hide the button and status bar items.
		extOutput.appendLine("> No doctests found");
		
		vscode.workspace.getConfiguration("doctestbtn").update("showButton", false);
		doctestStatus.hide();
		docstringStatus.hide();

	}
}

function doctestDetector(activeEditor: vscode.TextEditor) {
	/*
	Searches the active document for valid doctests.
	Returns the number of valid docstrings and doctests in the active file.
	*/
	var tripleDoubleQuotes = 0; 
	var tripleSingleQuotes = 0; 
	var totalDocstrings = 0;
	var totaldocTests = 0;

	const doc = activeEditor.document;

	for (var i = 0; i < doc.lineCount; i++) {											// Iterate through each line of text in the active doc
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
	totalDocstrings = ~~(tripleDoubleQuotes / 2) + ~~(tripleSingleQuotes / 2);			// Total docstrings = sum of floor division of total ''' and """ instances

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

	if (findTerminal("Python") > -1) {									// Check for a "Python" terminal
		const pyTerminal = terminals[findTerminal("Python")];			// If exists: get index
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

		const paths = getPaths();

		const doctestCommand = "& " + paths.python + " -m " + paths.doctest + " -v " + paths.file;	// Format the doctest command to be run
		
		dualLog("> Running doctest...");
		dualLog("> Python path: '" + paths.python + "'");
		dualLog("> Doctest path: '" + paths.doctest + "'");
		dualLog("> File path: '" + paths.file + "'");
		dualLog("> Formatted command: '" + doctestCommand + "'");
		dualLog("> Pushing command...");

		vscode.window.activeTextEditor.document.save();		// Save document before doctest is run
		terminal.sendText(doctestCommand);					// Send command to the terminal

	} else {
		vscode.window.showErrorMessage("DoctestBtn Error: 'No active text editor'");
	}
}

function getPaths() {
	const pythonPath = vscode.workspace.getConfiguration('python').pythonPath;				// Retrieve path for python executable
	const doctestPath = vscode.workspace.getConfiguration('doctestbtn').doctestPath;		// Retrieve path for the doctest module
	const filePath = vscode.window.activeTextEditor?.document.fileName;						// Retrieve path of current tile (to be doctested)

	return {"python": pythonPath,
			"doctest": doctestPath,
			"file": filePath};
}

function dualLog(text: string): void {
	/*
	Logs the given text in both the console and the extension's output window.
	*/
	console.log(text);
	extOutput.appendLine(text);
}

export function deactivate() {
	/*
	Called upon closure of extension.
	*/

}

