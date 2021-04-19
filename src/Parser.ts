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

    countDoctests(textEditor: vscode.TextEditor) {
        /*
            Searches the given document for valid doctests.
            Returns the number of valid docstrings and doctests in the active file.
        */
        var tripleDoubleQuotes = 0; 
        var tripleSingleQuotes = 0; 
        var totalDocstrings = 0;
        var totaldocTests = 0;
    
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
                    totaldocTests++;														
                }
            }
        }
        totalDocstrings = ~~(tripleDoubleQuotes / 2) + ~~(tripleSingleQuotes / 2);			// Total docstrings = sum of floor division of total ''' and """ instances
    
        this.utils.dualLog("> Counting doctests..." +
                         "\n> Doctests: " + totaldocTests +
                         "\n> Docstrings: " + totalDocstrings);

        return {
            "totalDocstrings": totalDocstrings,
            "totalDoctests": totaldocTests
        };
    }

    doctestLinter(textEditor: vscode.TextDocument) {
        /*
            Executes doctest silently and parses output.
        */
            const paths = this.config.getPaths();
            var failed = false;
    
            const execCommand = this.config.getDoctestCommand();
    
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
                } else {
                    console.log("Passed Doctest");
                    failed = false;
                }
            });
    }
}