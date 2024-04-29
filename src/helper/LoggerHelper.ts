/**
 * VSCode-PyDoctestBtn
 * logger.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import * as vscode from "vscode";

export class LoggerHelper {
	private static readonly logChannelPath = "LOG_CHANNEL";
	private static readonly logChannelName = "DoctestBtn";

	/**
	 * Initialize a LogOutputChannel and place it in the Extension Context for use
	 * @param context - The Extension Context to place initialized logger
	 * @param {string} name - The name of the LogOutputChannel to be initialized
	 * @returns LogOutputChannel
	 */
	public static initializeLogger(context: vscode.ExtensionContext, name: string): vscode.LogOutputChannel {
		let logChannel = vscode.window.createOutputChannel(name, { log: true });
		context.workspaceState.update(this.logChannelPath, logChannel);
		return logChannel;
	}

	/**
	 * Get the LogOutputChannel from the Extension Context
	 * @param context - The Extension Context containing the initialized logger
	 * @returns LogOutputChannel
	 */
	public static getLogger(context: vscode.ExtensionContext): vscode.LogOutputChannel {
		let channel: vscode.LogOutputChannel | undefined = context.workspaceState.get(this.logChannelPath);
		if (channel !== undefined) {
			return channel;
		} else {
			throw new Error("Log Channel not found in Extension Context workspaceState.");
		}
	}
}
