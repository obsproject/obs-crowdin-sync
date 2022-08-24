import { execSync } from 'child_process';
import { JEST_RUN } from './index';

/**
 * Waits a specific amount of milliseconds synchronously.
 *
 * @param millesec Number of milliseconds to wait.
 * @returns Promise resolution after `millesec` milliseconds.
 */
export function wait(millesec: number): Promise<void> {
	if (JEST_RUN) {
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
