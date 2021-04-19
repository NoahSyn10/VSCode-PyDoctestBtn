/*
    PyDoctestBtn
    Parser Class
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/

import { ConfigHandler } from './Handlers';
import { TerminalHandler } from './Handlers';
import { Utils } from './Utils';
import * as vscode from 'vscode';
import { config } from 'process';
import { exec } from 'child_process';

export class Parser {
    /*
        A class containing methods for the parsing of documents for various purposes.
    */

    config;
    utils;
    termHandler;

    constructor () {
        this.config = new ConfigHandler;
        this.utils = new Utils;
        this.termHandler = new TerminalHandler;
    }

    countDoctests(textEditor: vscode.TextEditor, callback: Utils["doubleNumCallback"]) {
        /*
            Searches the given document for valid doctests.
            Returns the number of valid docstrings and doctests in the active file.
        */
        var tripleDoubleQuotes = 0; 
        var tripleSingleQuotes = 0; 
        var totalDocstrings = 0;
        var totalDoctests = 0;
    
        const doc = textEditor.document;
    
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
                    totalDoctests++;														
                }
            }
        }
        totalDocstrings = ~~(tripleDoubleQuotes / 2) + ~~(tripleSingleQuotes / 2);			// Total docstrings = sum of floor division of total ''' and """ instances
    
        this.utils.dualLog("> Counting doctests..." +
                         "\n> Doctests: " + totalDoctests +
                         "\n> Docstrings: " + totalDocstrings);

        callback(totalDoctests, totalDocstrings);
    }

    doctestLinter(callback: Utils["singleNumCallback"]) {
        /*
            Executes doctest silently and parses output.
        */

            var failed = false;
            var numFailures = 0;
    
            const execCommand = this.config.getDoctestCommand();
    
            //vscode.window.activeTextEditor!.document.save();

            exec(execCommand, (err, result) => {
                if (err) {
                    console.log("Error: err tripped");
                }

                if (!vscode.window.activeTextEditor) {
                    return;
                }

                // Output last 4 lines of doctest result
                const summary = result.split('\n').slice(-6,-1);
                for (var i = 0; i < summary.length; i++) {
                    console.log(summary[i]);
                }
    
                // If failed, get total number of failures
                if (summary[4][0] === '*') {
                    console.log("Failed Doctest");
                    failed = true;
                    this.utils.dualLog("slice: " + summary[4].slice(18, -10));
                    numFailures = parseInt(summary[4].slice(18, -10));
                } else {
                    console.log("Passed Doctest");
                    failed = false;
                }

                // Find each failure and its line number.

                let diagnosticCollection = vscode.languages.createDiagnosticCollection('go');
                let diagnostics : vscode.Diagnostic[] = [];

                const results = result.split('\n').slice(0, -7);
                for (var i = 0; i < results.length; i++) {
                    if (results[i].length > 60 && results[i][0] === '*') {
                        var failureLine = parseInt(results[i + 1].split(', ')[1].slice(5));
                        this.utils.dualLog("Doctest failure on line " + failureLine.toString());

                        // Get range.
                        let doc = vscode.window.activeTextEditor.document;
                        let failureRange = new vscode.Range(failureLine, doc.lineAt(failureLine).firstNonWhitespaceCharacterIndex,
                                                     failureLine, doc?.lineAt(failureLine).text.length);
                        
                        // Get error message.
                        var errorMsg = "Failure";
                        let narrowedResults = results.slice(i);
                        for (var j = 0; j < narrowedResults.length; j++) {
                            if (narrowedResults[j].slice(0, 7) === "Trying:") {
                                errorMsg = "*" + narrowedResults[j-1].trim() + "*";
                                break;
                            }
                        }

                        // New Diagnostic.
                        diagnostics.push(new vscode.Diagnostic(failureRange, errorMsg, vscode.DiagnosticSeverity.Warning));
                    }
                }

                // Push diagnostics
                this.utils.dualLog(diagnostics.toString());
                if (vscode.window.activeTextEditor) {
                    diagnosticCollection.set(vscode.window.activeTextEditor?.document.uri, diagnostics);
                }

                callback(numFailures);
            });
    }
}