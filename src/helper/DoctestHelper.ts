/**
 * PyDoctestBtn
 * DoctestHelper.ts
 * © 2024 Noah Synowiec - @NoahSyn10
 */

import { Logger } from "../helper/Logger";

let log: Logger = new Logger("DoctestHelper");

/**
 * Doctest Helper
 */
export class DoctestHelper {
	public static getDoctestCommand(pythonPath: string, doctestPath: string, filePath: string, verbose: boolean = true): string {
		let v = " -v "; // default to verbose
		if (verbose === false) {
			v = " ";
		}

		let doctestCommand = pythonPath + " -m " + doctestPath + v + '"' + filePath + '"';
		log.debug(`Doctest Command Generated: [${doctestCommand}]`);
		return doctestCommand;
	}
}
