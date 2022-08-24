import REMOVE_NPM_PATHS from 'removeNPMAbsolutePaths';
import { execSync } from 'child_process';
import FSE from 'fs-extra';

REMOVE_NPM_PATHS('node_modules');
execSync('ncc build src/index.ts -m');
FSE.move('dist/index.js', 'dist.js', { overwrite: true });
