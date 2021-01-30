// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "doctestbtn" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('doctestbtn.runDoctest', () => {
		// The code you place here will be executed every time your command is executed
		
		const terminals = vscode.window.terminals;

		if (findTerminal("Python") > -1) {
			const pyTerminal = terminals[findTerminal("Python")];
			pyTerminal.show();
			execDoctest(pyTerminal);
		} else if (findTerminal("Doctest") > -1) {
			const docTerminal = terminals[findTerminal("Doctest")];
			docTerminal.show();
			execDoctest(docTerminal);
		} else if (vscode.window.activeTerminal) {
			const activeTerminal = vscode.window.activeTerminal;
			activeTerminal.show();
			execDoctest(activeTerminal);
		} else {
			const docTerminal = vscode.window.createTerminal(`Doctest`);
			docTerminal.show();
			execDoctest(docTerminal);
		}

	});

	context.subscriptions.push(disposable);
}

function selectTerminal(): Thenable<vscode.Terminal | undefined> {
	interface TerminalQuickPickItem extends vscode.QuickPickItem {
		terminal: vscode.Terminal;
	}
	const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
	const items: TerminalQuickPickItem[] = terminals.map(t => {
		return {
			label: `name: ${t.name}`,
			terminal: t
		};
	});
	return vscode.window.showQuickPick(items).then(item => {
		return item ? item.terminal : undefined;
	});
}

function findTerminal(termName: String): number {
	const terminals = vscode.window.terminals;
	for (let i = 0; i < terminals.length; i++) {
		if (terminals[i].name === termName) {
			return i;
		}
	}
	return -1;
}

function execDoctest(terminal: vscode.Terminal) {
	const doctestCmd = "echo 'Sent text immediately after creating'";
	terminal.sendText(doctestCmd);
}

// this method is called when your extension is deactivated
export function deactivate() {}
