/*
	PyDoctestBtn
	Extension Activation
	© 2021 Noah Synowiec - noahsyn1@gmail.com
*/	

import { fstat } from 'fs';
import { eventNames, stderr } from 'process';
import * as vscode from 'vscode';

import { DoctestBtn } from './DoctestBtn';
import { ConfigHandler } from './Handlers';
import { Utils } from './Utils';

export function activate(context: vscode.ExtensionContext) {
	/*
		Called once upon activation of extension.
		Initializes elements and listeners.
	*/
	let doctestBtn = new DoctestBtn;
	let utils = new Utils;

	readConfig(doctestBtn);
	let configListener = vscode.workspace.onDidChangeConfiguration(() => readConfig(doctestBtn));
	context.subscriptions.push(configListener);

	utils.dualLog('> DoctestBtn active');

	let plainButton = vscode.commands.registerCommand('doctestbtn.execDoctest_plain', () => doctestBtn.execDoctest());
	let fancyButton = vscode.commands.registerCommand('doctestbtn.execDoctest_fancy', () => doctestBtn.execDoctest());		
	let xtraFancyButton = vscode.commands.registerCommand('doctestbtn.execDoctest_xtraFancy', () => doctestBtn.execDoctest());
	context.subscriptions.push(plainButton);
	context.subscriptions.push(fancyButton);			// Initialize each button command (one for each 'style')
	context.subscriptions.push(xtraFancyButton);
	
	let docEditListener = vscode.workspace.onDidChangeTextDocument((docChange: vscode.TextDocumentChangeEvent) => doctestBtn.doctestHandler(vscode.window.activeTextEditor, docChange));	
	let editorSwitchListener = vscode.window.onDidChangeActiveTextEditor((newTextEditor?: vscode.TextEditor) => doctestBtn.updateAll(newTextEditor));
	let saveListener = vscode.workspace.onDidSaveTextDocument(() => doctestBtn.updateAll(undefined));
	context.subscriptions.push(docEditListener);		// Listen for edits to active doc.
	context.subscriptions.push(editorSwitchListener);	// Listen for change of active doc.
	context.subscriptions.push(saveListener);			// Listen for save of active doc.

	doctestBtn.updateAll(vscode.window.activeTextEditor);
}

export function readConfig(dtBtnObj : DoctestBtn) {
	/*
		Retrieve config values and adjust functionality accordingly.
	*/
	let config = new ConfigHandler;

	// Status Bar Configurations
	let statusBarConfig = config.getStatusbarConfig();
	if (statusBarConfig.dtCountConfig) { 
		dtBtnObj.dtCountEnabled = true; 
	} else { 
		dtBtnObj.dtCountEnabled = false; 
		dtBtnObj.config.hideDoctestCount();
	}
	if (statusBarConfig.dtStatusConfig) {
		dtBtnObj.dtStatusEnabled = true;
	} else {
		dtBtnObj.dtStatusEnabled = false;
		dtBtnObj.config.hideDoctestStatus();
	}

	let lintCondition = config.getLinterConfig();
	switch(lintCondition) {
		case "Never": {
			
			break;
		}
		case "On Save": {

			break;
		}
		case "On Change": {

			break;
		}
	}
}

export function deactivate() {
	/*
		Called upon closure of extension.
	*/
}