import { execSync } from 'child_process';
import { JEST_RUN } from './index';

export function wait(millesec: number): Promise<void> {
	if (JEST_RUN) {
		millesec = 0;
	}
	return new Promise(resolve => setTimeout(resolve, millesec));
}

export function exec(command: string): string {
	return execSync(command).toString();
}

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
