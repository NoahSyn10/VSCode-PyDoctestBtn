/**
 * VSCode-PyDoctestBtn
 * logger.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import { error } from "console";
import * as vscode from "vscode";

export class Logger {
	private static logChannel: vscode.LogOutputChannel;
	private alias: string;
	private logString: string;

	/**
	 * Initialize a {@link vscode.LogOutputChannel LogOutputChannel} with the given name and store it as a class variable.
	 * The LogOutputChannel initialized will be used by all instances of the Logger class.
	 *
	 * It is recomended that this function is called once at the activation of the extension. If it is called multiple
	 * times, the LogOutputChannel will be overwritten for all existing Logger instances.
	 *
	 * @param name
	 */
	public static initLogChannel(name: string) {
		Logger.logChannel = vscode.window.createOutputChannel(name, { log: true });
	}

	/**
	 * Logger Constructor
	 *
	 * Stores either the alias or the name of the given Class for use when logging
	 *
	 * @param alias A name for the logger to be created OR a Class from which to extract the name
	 */
	constructor(alias: string | (new (...args: any[]) => any)) {
		if (typeof alias === "string") {
			this.alias = alias;
		} else {
			this.alias = alias.name;
		}

		this.logString = `${this.alias}${" ".repeat(20 - this.alias.length)} :: `;
	}

	/**
	 * Outputs the given trace message to the channel. Use this method to log verbose information.
	 *
	 * The message is only logged if the channel is configured to display {@link vscode.LogLevel.Trace trace} log level.
	 *
	 * @param message trace message to log
	 */
	trace(message: string, ...args: any[]): void {
		if (args.length === 0) {
			Logger.logChannel.trace(this.logString + message);
		} else {
			Logger.logChannel.trace(this.logString + message, args);
		}
	}

	/**
	 * Outputs the given debug message to the channel.
	 *
	 * The message is only logged if the channel is configured to display {@link vscode.LogLevel.Debug debug} log level or lower.
	 *
	 * @param message debug message to log
	 */
	debug(message: string, ...args: any[]): void {
		if (args.length === 0) {
			Logger.logChannel.debug(this.logString + message);
		} else {
			Logger.logChannel.debug(this.logString + message, args);
		}
	}

	/**
	 * Outputs the given information message to the channel.
	 *
	 * The message is only logged if the channel is configured to display {@link vscode.LogLevel.Info info} log level or lower.
	 *
	 * @param message info message to log
	 */
	info(message: string, ...args: any[]): void {
		if (args.length === 0) {
			Logger.logChannel.info(this.logString + message);
		} else {
			Logger.logChannel.info(this.logString + message, args);
		}
	}

	/**
	 * Outputs the given warning message to the channel.
	 *
	 * The message is only logged if the channel is configured to display {@link vscode.LogLevel.Warning warning} log level or lower.
	 *
	 * @param message warning message to log
	 */
	warn(message: string, ...args: any[]): void {
		if (args.length === 0) {
			Logger.logChannel.warn(this.logString + message);
		} else {
			Logger.logChannel.warn(this.logString + message, args);
		}
	}

	/**
	 * Outputs the given error or error message to the channel.
	 *
	 * The message is only logged if the channel is configured to display {@link vscode.LogLevel.Error error} log level or lower.
	 *
	 * @param error Error or error message to log
	 */
	error(error: string | Error, ...args: any[]): void {
		if (args.length === 0) {
			Logger.logChannel.error(this.logString + error);
		} else {
			Logger.logChannel.error(this.logString + error, args);
		}
	}
}
