/*
    PyDoctestBtn
    ConfidHandler Class
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/

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

    // Generate Doctest command from preferences.
    getDoctestCommand() {
        /*
            Format the doctest command to be run.
        */
        const paths = this.getPaths();
        return paths.python + " -m " + paths.doctest + " -v " + paths.file;
    }
}