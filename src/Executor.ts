/*
    PyDoctestBtn
    Executor Class
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/
import {ConfigHandler} from './ConfigHandler';
import { exec } from 'child_process';
import * as vscode from 'vscode';

class Executor {

    config;

    constructor () {
        this.config = new ConfigHandler;
    }

    // Create executable string
    getExecutable() {
        /*
            Format the doctest command to be run.
        */
        const paths = this.config.getPaths();
        return paths.python + " -m " + paths.doctest + " -v " + paths.file;
    }

    // Execute doctest
    execDoctest(terminal: vscode.Terminal) {
        /*
            Execute doctest in terminal using formatted executable (after saving doc).
        */
        const doctestCommand = this.getExecutable();
        vscode.window.activeTextEditor!.document.save();    // Save document before doctest is run
		terminal.sendText(doctestCommand);					// Send command to the terminal
    }
}