/*
    PyDoctestBtn
    ConfidHandler Class
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/

import { exec } from 'child_process';
import * as vscode from 'vscode';

export class ConfigHandler {

    constructor () {}

    // Get path settings.
    public getPaths() {
        const pythonPath = vscode.workspace.getConfiguration('python').pythonPath;				// Retrieve path for python executable.
        const doctestPath = vscode.workspace.getConfiguration('doctestbtn').doctestPath;		// Retrieve path for the doctest module.
        const filePath = vscode.window.activeTextEditor?.document.fileName;						// Retrieve path of current file (to be doctested).
    
        return {"python": pythonPath,
                "doctest": doctestPath,
                "file": filePath};
    }

    // Get button settings.


    // Set button settings.
}