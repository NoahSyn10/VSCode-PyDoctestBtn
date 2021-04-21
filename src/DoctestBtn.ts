/*
    PyDoctestBtn
    DoctestBtn Class
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/

import { exec } from 'child_process';
import { ConfigHandler } from './Handlers';
import { TerminalHandler } from './Handlers';
import { Parser } from './Parser';
import { Utils } from './Utils';
import * as vscode from 'vscode';

export class DoctestBtn {
    /*
        A class containing methods that are triggered by the extension's event listeners.
        This class combines the functionality of all other classes to make the DoctestBtn extension.
    */

    config;
    parser;
    terminalHandler;
    utils;

    constructor () {
        this.config = new ConfigHandler;
        this.parser = new Parser;
        this.terminalHandler = new TerminalHandler;
        this.utils = new Utils;
    }

    execDoctest() {
        /*
            Excecutes the doctest command in the main terminal.
        */
        let terminal = this.terminalHandler.getMainTerminal();
        let doctestCommand = this.config.getDoctestCommand();
        this.terminalHandler.executeInTerminal(terminal, doctestCommand);

        this.utils.dualLog("> Executing Doctest...");
    }

    updateAll(activeEditor: vscode.TextEditor | undefined) {
        this.doctestHandler(activeEditor);
        this.linter();
    }

    doctestHandler(activeEditor: vscode.TextEditor | undefined, docChange?: vscode.TextDocumentChangeEvent): void {
        /*
            Get data on doctests in file and update menu and status bar accordingly.
        */
        if ((docChange && docChange?.document.fileName !== activeEditor?.document.fileName) || activeEditor?.document.languageId !== "python") {
            return;													                // Check if change was in the active editor & if the editor is a .py file
        }
        
        this.utils.dualLog("> Scanning file for doctests...");

        this.parser.countDoctests(activeEditor, (totalDoctests, totalDocstrings) => {
            if (totalDoctests > 0) {			
                this.utils.dualLog("> " + totalDoctests + " doctests found.");		// If there are doctests, show button and status bar items.                                                       
                this.config.showDoctestBtn(totalDoctests);
        
            } else {							                                    // If there are none, hide the button and status bar items.            
                this.utils.dualLog("> No doctests found.");
                this.config.hideDoctestBtn();
            }
        });
    }

    linter() {
        const execCommand = this.config.getDoctestCommand(false);

        exec(execCommand, (err, result) => {
            if (err) { console.log("exec err: " + err); };

            this.parser.doctestLinter(result, (numFailures, failures) => {
                if (!vscode.window.activeTextEditor) { return; }

                if (numFailures < 1) {
                    this.config.showDoctestStatus("passing");
                } else {
                    this.config.showDoctestStatus(numFailures + " failures");
                }

                failures.forEach((failure) => {
                    this.utils.dualLog(failure.errorMsg);
                    this.config.pushDiagnostic(failure.range, failure.errorMsg);
                });

                this.config.updateDiagnostics(vscode.window.activeTextEditor.document.uri);
            });
        });
    }
}