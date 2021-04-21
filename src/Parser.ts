/*
    PyDoctestBtn
    Parser Class
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/

import { ConfigHandler } from './Handlers';
import { TerminalHandler } from './Handlers';
import { Utils } from './Utils';
import { DoctestFailure } from './Utils';
import * as vscode from 'vscode';
import { config } from 'process';
import { exec } from 'child_process';
import { privateEncrypt } from 'crypto';

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

    doctestLinter(doctestOutput: string, callback: Utils["failureCallback"]) {
        /*
            Parses the doctest output, creating failure objects from each failure.
        */
        if (doctestOutput === "") { callback(); return; }
        if (!vscode.window.activeTextEditor) { return; }

        let doc = vscode.window.activeTextEditor.document;  // Active doc.

        let outputBlocks = doctestOutput.split("*".repeat(70)).slice(1, -1);

        let promises = outputBlocks.map((failure) => {                  // Use promises to return result after object creation.
            return new Promise<DoctestFailure>((resolve) => {  
                return resolve(new DoctestFailure(failure, doc));       // Create failure object for each outputblock.
            });
        });

        Promise.all(promises).then((failureList) => { callback(failureList); });
    }
}