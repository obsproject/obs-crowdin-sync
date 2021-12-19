import REMOVE_NPM_PATHS from 'removeNPMAbsolutePaths';
import { execSync } from 'child_process';
import FSE from 'fs-extra';

REMOVE_NPM_PATHS('node_modules');
execSync('ncc build src/download.ts -o download -m');
execSync('ncc build src/upload.ts -o upload -m');
FSE.move('download/index.js', 'download/dist.js', { overwrite: true });
FSE.move('upload/index.js', 'upload/dist.js', { overwrite: true });
FSE.remove('download/package.json');
FSE.remove('upload/package.json');
