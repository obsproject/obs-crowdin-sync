import FSE from 'fs-extra';
import PATH from 'path';
import { execSync } from 'child_process';

/**
 * Waits a specific amount of milliseconds synchronously.
 *
 * @param millesec Number of milliseconds to wait.
 * @returns Promise resolution after `millesec` milliseconds.
 */
export function wait(millesec: number): Promise<any> {
	if (process.env.JEST_WORKER_ID !== undefined) {
		millesec = 0;
	}
	return new Promise(resolve => setTimeout(resolve, millesec));
}

/**
 * Executes a command.
 *
 * @param command Command line command to run.
 * @returns The command output.
 */
export function exec(command: string): string {
	return execSync(command).toString();
}

/**
 * Trims and normalizes the line endings of a `string`.
 *
 * @param text The text to normalize.
 * @returns The normalized text.
 */
export function normalize(text: string): string {
	text = text.trim();
	while (text.includes('\r\n')) {
		text = text.replace('\r\n', '\n');
	}
	while (text.includes('\n\n')) {
		text = text.replace('\n\n', '\n');
	}
	return text;
}

/**
 * Converts a directoy structure with all sub-files into one object.
 *
 * @param filePath The path to the file or directory.
 * @returns An object representing a directory structure.
 */
export async function convertFileStructureToObject(filePath: string): Promise<{}> {
	filePath = PATH.resolve(filePath);
	if (!(await FSE.pathExists(filePath))) {
		return {};
	}
	if ((await FSE.lstat(filePath)).isFile()) {
		return {
			name: PATH.basename(filePath),
			content: await FSE.readFile(filePath, { encoding: 'utf-8' })
		};
	} else {
		const fileList = [];
		const dirFiles = await FSE.readdir(filePath);
		for (const file of dirFiles) {
			if (dirFiles.length === 1) {
				const subfolderFileStructure = (await convertFileStructureToObject(`${filePath}/${file}`)) as any;
				return {
					name: `${PATH.basename(filePath)}/${subfolderFileStructure.name}`,
					content: subfolderFileStructure.content
				};
			}
			fileList.push(await convertFileStructureToObject(`${filePath}/${file}`));
		}
		return {
			name: PATH.basename(filePath),
			content: fileList
		};
	}
}
