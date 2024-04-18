/*
    PyDoctestBtn
    Handler Classes
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/

import { DoctestFailure, Utils } from "./Utils";
import * as vscode from "vscode";
import { config } from "process";
import { exec } from "child_process";

export class TerminalHandler {
	/*
        A class containing methods related to the retrieval and use of integrated terminals.
    */

	utils;
	tempResult;

	constructor() {
		this.utils = new Utils();
		this.tempResult = "";
	}

	findTerminal(termName: String): number {
		/*
            Searches for an open terminal with the given 'termName' as its name.
            Returns the index of the terminal if found, -1 otherwise.
        */
		const terminals = vscode.window.terminals; // Get list of active terminals.
		for (let i = 0; i < terminals.length; i++) {
			if (terminals[i].name === termName) {
				// Check each list for provided name.
				return i; // Return index if found.
			}
		}
		return -1; // Return -1 otherwise.
	}

	getMainTerminal(): vscode.Terminal {
		/*
            Returns the terminal with highest 'priority', and creates one if none exists.
            Priority levels by terminal name:
            - 'Python'
            - 'Doctest'
            - Any other open terminal
        */
		const terminals = vscode.window.terminals; // Get list of active terminals.

		this.utils.dualLog("> Retrieving main terminal...");

		if (this.findTerminal("Python") > -1) {
			// Check for "Python" terminal.
			this.utils.dualLog("> Python terminal found.");
			return terminals[this.findTerminal("Python")];
		} else if (this.findTerminal("Doctest") > -1) {
			// Check for "Doctest" terminal.
			this.utils.dualLog("> Doctest terminal found.");
			return terminals[this.findTerminal("Doctest")];
		} else if (vscode.window.activeTerminal) {
			//  If neither exists check for any active terminal.
			this.utils.dualLog("> Active terminal '" + vscode.window.activeTerminal.name + "' found.");
			return vscode.window.activeTerminal;
		} else {
			// If no terminal exists, create "Doctest" terminal.
			this.utils.dualLog("> Doctest terminal created.");
			return vscode.window.createTerminal("Doctest");
		}
	}

	executeInTerminal(terminal: vscode.Terminal, command: string) {
		/*
            Execute given string in given terminal, after saving active document.
        */
		this.utils.dualLog("> Executing command '" + command.slice(0, 5) + "...' in terminal '" + terminal.name + "'");
		vscode.window.activeTextEditor!.document.save(); // Save document before command is run
		terminal.sendText(command); // Send command to the terminal
	}
}

export class ConfigHandler {
	/*
        A class holding methods for getting and setting configurations.
    */

	utils;

	doctestCount;
	doctestStatus;

	diagnosticCollection;
	diagnostics: vscode.Diagnostic[];

	constructor() {
		this.utils = new Utils();

		this.doctestCount = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100.3);
		this.doctestStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100.3);

		this.diagnosticCollection = vscode.languages.createDiagnosticCollection("go");
		this.diagnostics = [];
	}

	public getPaths() {
		/*
            Retrieves the paths for the executables to be used and the current file, and returns them as an object.
        */
		const pythonPath = vscode.workspace.getConfiguration("python").defaultInterpreterPath; // Retrieve path for python executable.
		const doctestPath = vscode.workspace.getConfiguration("doctestbtn").doctestPath; // Retrieve path for the doctest module.
		const filePath = vscode.window.activeTextEditor?.document.fileName; // Retrieve path of current file (to be doctested).

		this.utils.dualLog(
			"> Retrieving paths..." +
				"\n> Python: " +
				pythonPath +
				"\n> Doctest: " +
				doctestPath +
				"\n> Doctest: " +
				doctestPath
		);

		return { python: pythonPath, doctest: doctestPath, file: filePath };
	}

	getDoctestCommand(verbose?: boolean) {
		/*
            Format the doctest command to be run.
        */
		var v = " ";
		if (verbose === true) {
			v = " -v ";
		} else if (verbose === false) {
			v = " ";
		} else {
			/* Get from config*/
			v = " -v ";
		}

		const paths = this.getPaths();
		let doctestCommand = paths.python + " -m " + paths.doctest + v + '"' + paths.file + '"';
		this.utils.dualLog("> Command: " + doctestCommand);
		return doctestCommand;
	}

	getStatusbarConfig() {
		/*
            Return the boolean values for the status bar configuration options.
        */
		var dtCountConfig = vscode.workspace.getConfiguration("doctestbtn").statusBar.showDoctestCount;
		var dtStatusConfig = vscode.workspace.getConfiguration("doctestbtn").statusBar.showDoctestStatus;

		return { dtCountConfig, dtStatusConfig };
	}

	getLinterConfig() {
		/*
            Return the string value for the doctest linting configuration.
        */
		var lintCondition = vscode.workspace.getConfiguration("doctestbtn").statusBar.lintCondition;

		return lintCondition;
	}

	showDoctestBtn() {
		/*
            Makes the doctest button and status bar counter visible after setting counter to given count.
        */
		vscode.workspace.getConfiguration("doctestbtn").update("showButton", true);
	}

	hideDoctestBtn() {
		/*
            Hides the doctest button and status bar counter.
        */
		vscode.workspace.getConfiguration("doctestbtn").update("showButton", false);
	}

	showDoctestCount(totalDoctests: Number) {
		/*
            Shows the doctest count status bar item.
        */
		this.doctestCount.text = "Doctests: " + totalDoctests;
		this.doctestCount.show();
	}

	hideDoctestCount() {
		/*
            Hides the doctest count status bar item.
        */
		this.doctestCount.hide();
	}

	showDoctestStatus(status: string) {
		/*
            Shows the doctest status bar item with the current status.
        */
		this.doctestStatus.text = "Status: " + status;
		this.doctestStatus.show();
	}

	hideDoctestStatus() {
		/*
            Hides the doctest status bar item.
        */
		this.doctestStatus.hide();
	}

	pushDiagnostic(range: vscode.Range, message: string): number {
		/*
            Pushes the given diagnostic item to current diagnostics.
            Returns the current number of diagnostics.
        */
		let severity = vscode.DiagnosticSeverity.Warning; // TODO: get from config
		this.diagnostics.push(new vscode.Diagnostic(range, message, severity));

		return this.diagnostics.length;
	}

	updateDiagnostics(docUri: vscode.Uri) {
		/*
            Resets the diagnostic collection with the current set of diagnostics.
            Clears diagnostics.
        */
		this.diagnosticCollection.clear;
		this.diagnosticCollection.set(docUri, this.diagnostics);
		this.diagnostics = [];
	}
}
