/*
    PyDoctestBtn
    TerminalHandler Class
    © 2021 Noah Synowiec - noahsyn1@gmail.com
*/

import { exec } from 'child_process';
import * as vscode from 'vscode';

class TerminalHandler {

    constructor () {}

    // Find terminal.
    findTerminal(termName: String): number {
        /*
            Searches for an open terminal with the given 'termName' as its name.
            Returns the index of the terminal if found, -1 otherwise.
        */
        const terminals = vscode.window.terminals;			// Get list of active terminals.
        for (let i = 0; i < terminals.length; i++) {
            if (terminals[i].name === termName) {			// Check each list for provided name.
                return i;									// Return index if found.
            }
        }
        return -1;											// Return -1 otherwise.
    }

    // Handle terminal precedence and creation.
    getMainTerminal(): vscode.Terminal {
        /*
            Returns the terminal with highest 'priority', and creates one if none exists.
            Priority levels by terminal name:
            - 'Python'
            - 'Doctest'
            - Any other open terminal
        */
        const terminals = vscode.window.terminals;              // Get list of active terminals.

        if (this.findTerminal("Python") > -1) {                 // Check for "Python" terminal.
            return terminals[this.findTerminal("Python")];      

        } else if (this.findTerminal("Doctest") > -1) {         // Check for "Doctest" terminal.
            return terminals[this.findTerminal("Doctest")];        

        } else if (vscode.window.activeTerminal) {	            //  If neither exists check for any active terminal.
            return vscode.window.activeTerminal;

        } else {                                                // If no terminal exists, create "Doctest" terminal.
            return vscode.window.createTerminal(`Doctest`);     
        }	
    }    
}