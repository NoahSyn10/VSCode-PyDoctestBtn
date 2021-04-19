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
    
                const summary = result.split('\n').slice(-6,-1);
                for (var i = 0; i < summary.length; i++) {
                    console.log(summary[i]);
                }
    
                if (summary[4][1] === '*') {
                    console.log("Failed Doctest");
                    failed = true;
                    this.utils.dualLog("slice: " + summary[4].slice(18, -10));
                    numFailures = parseInt(summary[4].slice(18, -10));

                } else {
                    console.log("Passed Doctest");
                    failed = false;
                }

                callback(numFailures);
            });
    }
}