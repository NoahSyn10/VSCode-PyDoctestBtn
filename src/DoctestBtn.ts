/*
    PyDoctestBtn
    DoctestBtn Class
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/

import {ConfigHandler} from './ConfigHandler';
import {Parser} from './Parser';
import {TerminalHandler} from './TerminalHandler';
import * as vscode from 'vscode';

export class DoctestBtn {

    config;
    parser;
    terminalHandler;

    doctestStatus;

    constructor () {
        this.config = new ConfigHandler;
        this.parser = new Parser;
        this.terminalHandler = new TerminalHandler;

        this.doctestStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100.3);
    }

    execDoctest() {
        /*
            Excecutes the doctest command in the main terminal.
        */
        let terminal = this.terminalHandler.getMainTerminal();
        let doctestCommand = this.config.getDoctestCommand();
        this.terminalHandler.executeInTerminal(terminal, doctestCommand);
    }

    doctestHandler(activeEditor: vscode.TextEditor | undefined, docChange?: vscode.TextDocumentChangeEvent): void {
        /*
            Get data on doctests in file and update menu and status bar accordingly.
        */
        if ((docChange && docChange?.document.fileName !== activeEditor?.document.fileName) || activeEditor?.document.languageId !== "python") {
            return;																				// Check if change was in the active editor & if the editor is a .py file
        }
        
        const docData = this.parser.countDoctests(activeEditor);
    
        if (docData?.totalDoctests > 0) {														// If there are doctests, show button and status bar items.                                                       
            vscode.workspace.getConfiguration("doctestbtn").update("showButton", true);
            this.doctestStatus.text = "Doctests: " + docData.totalDoctests;
            this.doctestStatus.show();
    
        } else {																				// If there are none, hide the button and status bar items.            
            vscode.workspace.getConfiguration("doctestbtn").update("showButton", false);
            this.doctestStatus.hide();
    
        }
    }

    linter(textEditor: vscode.TextDocument) {
        this.parser.doctestLinter(textEditor);
    }
}