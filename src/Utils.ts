/*
    PyDoctestBtn
    Utils Class
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/

import * as vscode from 'vscode';

export class Utils {

    extOutput;

    constructor () {
        this.extOutput = vscode.window.createOutputChannel("DoctestBtn");
    }

    dualLog(text: string): void {
        /*
            Logs the given text in both the console and the extension's output window.
        */
        console.log(text);
        this.extOutput.appendLine(text);
    }
}