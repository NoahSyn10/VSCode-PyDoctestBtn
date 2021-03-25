/*
    PyDoctestBtn
    ConfidHandler Class
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/

import { Utils } from './Utils';
import * as vscode from 'vscode';

export class ConfigHandler {

    utils;
    doctestStatus;

    constructor () {
        this.utils = new Utils;
        this.doctestStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100.3);
    }

    public getPaths() {
        /*
            Retrieves the paths for the executables to be used and the current file, and returns them as an object.
        */
        const pythonPath = vscode.workspace.getConfiguration('python').pythonPath;				// Retrieve path for python executable.
        const doctestPath = vscode.workspace.getConfiguration('doctestbtn').doctestPath;		// Retrieve path for the doctest module.
        const filePath = vscode.window.activeTextEditor?.document.fileName;						// Retrieve path of current file (to be doctested).
    
        this.utils.dualLog("> Retrieving paths..." + 
                         "\n> Python: " + pythonPath + 
                         "\n> Doctest: " + doctestPath + 
                         "\n> Doctest: " + doctestPath);

        return {"python": pythonPath,
                "doctest": doctestPath,
                "file": filePath};
    }

    // Get button settings.

    // Set button settings.

    getDoctestCommand() {
        /*
            Format the doctest command to be run.
        */
        const paths = this.getPaths();
        let doctestCommand = paths.python + " -m " + paths.doctest + " -v " + paths.file;
        this.utils.dualLog("> Command: " + doctestCommand);
        return doctestCommand;
    }

    showDoctestBtn(totalDoctests: Number) {
        /*
            Makes the doctest button and status bar counter visible after setting counter to given count.
        */
        vscode.workspace.getConfiguration("doctestbtn").update("showButton", true);
        this.doctestStatus.text = "Doctests: " + totalDoctests;
        this.doctestStatus.show();
    }

    hideDoctestBtn() {
        /*
            Hides the doctest button and status bar counter.
        */
        vscode.workspace.getConfiguration("doctestbtn").update("showButton", false);
        this.doctestStatus.hide();
    }
}