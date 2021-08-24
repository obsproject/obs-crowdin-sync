/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9190:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(2861);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 5316:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(9190);
const file_command_1 = __nccwpck_require__(3685);
const utils_1 = __nccwpck_require__(2861);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 3685:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(2861);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 2861:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 4735:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrowdinApi = exports.BooleanInt = exports.PatchOperation = exports.HttpClientType = void 0;
const axiosProvider_1 = __nccwpck_require__(4144);
const fetchClient_1 = __nccwpck_require__(3319);
const retry_1 = __nccwpck_require__(9359);
var HttpClientType;
(function (HttpClientType) {
    HttpClientType["AXIOS"] = "axios";
    HttpClientType["FETCH"] = "fetch";
})(HttpClientType = exports.HttpClientType || (exports.HttpClientType = {}));
var PatchOperation;
(function (PatchOperation) {
    PatchOperation["ADD"] = "add";
    PatchOperation["REMOVE"] = "remove";
    PatchOperation["REPLACE"] = "replace";
    PatchOperation["MOVE"] = "move";
    PatchOperation["copy"] = "copy";
    PatchOperation["TEST"] = "test";
})(PatchOperation = exports.PatchOperation || (exports.PatchOperation = {}));
var BooleanInt;
(function (BooleanInt) {
    BooleanInt[BooleanInt["TRUE"] = 1] = "TRUE";
    BooleanInt[BooleanInt["FALSE"] = 0] = "FALSE";
})(BooleanInt = exports.BooleanInt || (exports.BooleanInt = {}));
class CrowdinApi {
    /**
     * @param credentials credentials
     * @param config optional configuration of the client
     */
    constructor(credentials, config) {
        this.fetchAllFlag = false;
        this.token = credentials.token;
        this.organization = credentials.organization;
        if (!!credentials.baseUrl) {
            this.url = credentials.baseUrl;
        }
        else {
            if (!!this.organization) {
                this.url = `https://${this.organization}.${CrowdinApi.CROWDIN_URL_SUFFIX}`;
            }
            else {
                this.url = `https://${CrowdinApi.CROWDIN_URL_SUFFIX}`;
            }
        }
        let retryConfig;
        if (!!config && !!config.retryConfig) {
            retryConfig = config.retryConfig;
        }
        else {
            retryConfig = {
                waitInterval: 0,
                retries: 0,
                conditions: [],
            };
        }
        this.retryService = new retry_1.RetryService(retryConfig);
        this.config = config;
    }
    addQueryParam(url, name, value) {
        if (!!value) {
            url += new RegExp(/\?.+=.*/g).test(url) ? '&' : '?';
            url += `${name}=${value}`;
        }
        return url;
    }
    defaultConfig() {
        const config = {
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
        };
        if (!!this.config) {
            if (!!this.config.userAgent) {
                config.headers['User-Agent'] = this.config.userAgent;
            }
            if (!!this.config.integrationUserAgent) {
                config.headers['X-Crowdin-Integrations-User-Agent'] = this.config.integrationUserAgent;
            }
        }
        return config;
    }
    get httpClient() {
        if (!!this.config) {
            if (!!this.config.httpClient) {
                return this.config.httpClient;
            }
            if (!!this.config.httpClientType) {
                switch (this.config.httpClientType) {
                    case HttpClientType.AXIOS:
                        return CrowdinApi.AXIOS_INSTANCE;
                    case HttpClientType.FETCH:
                        return CrowdinApi.FETCH_INSTANCE;
                    default:
                        return CrowdinApi.AXIOS_INSTANCE;
                }
            }
        }
        return CrowdinApi.AXIOS_INSTANCE;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    withFetchAll(maxLimit) {
        this.fetchAllFlag = true;
        this.maxLimit = maxLimit;
        return this;
    }
    getList(url, limit, offset, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const conf = config || this.defaultConfig();
            if (this.fetchAllFlag) {
                this.fetchAllFlag = false;
                const maxAmount = this.maxLimit;
                this.maxLimit = undefined;
                return yield this.fetchAll(url, conf, maxAmount);
            }
            else {
                url = this.addQueryParam(url, 'limit', limit);
                url = this.addQueryParam(url, 'offset', offset);
                return this.get(url, conf);
            }
        });
    }
    fetchAll(url, config, maxAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            let limit = 500;
            if (!!maxAmount && maxAmount < limit) {
                limit = maxAmount;
            }
            let offset = 0;
            let resp;
            for (;;) {
                let urlWithPagination = this.addQueryParam(url, 'limit', limit);
                urlWithPagination = this.addQueryParam(urlWithPagination, 'offset', offset);
                const e = yield this.get(urlWithPagination, config);
                if (!resp) {
                    resp = e;
                }
                else {
                    resp.data = resp.data.concat(e.data);
                    resp.pagination.limit += e.data.length;
                }
                if (e.data.length < limit || (!!maxAmount && resp.data.length >= maxAmount)) {
                    break;
                }
                else {
                    offset += limit;
                }
                if (!!maxAmount) {
                    if (maxAmount < resp.data.length + limit) {
                        limit = maxAmount - resp.data.length;
                    }
                }
            }
            return resp;
        });
    }
    //Http overrides
    get(url, config) {
        return this.retryService.executeAsyncFunc(() => this.httpClient.get(url, config));
    }
    delete(url, config) {
        return this.retryService.executeAsyncFunc(() => this.httpClient.delete(url, config));
    }
    head(url, config) {
        return this.retryService.executeAsyncFunc(() => this.httpClient.head(url, config));
    }
    post(url, data, config) {
        return this.retryService.executeAsyncFunc(() => this.httpClient.post(url, data, config));
    }
    put(url, data, config) {
        return this.retryService.executeAsyncFunc(() => this.httpClient.put(url, data, config));
    }
    patch(url, data, config) {
        return this.retryService.executeAsyncFunc(() => this.httpClient.patch(url, data, config));
    }
}
exports.CrowdinApi = CrowdinApi;
CrowdinApi.CROWDIN_URL_SUFFIX = 'api.crowdin.com/api/v2';
CrowdinApi.AXIOS_INSTANCE = new axiosProvider_1.AxisProvider().axios;
CrowdinApi.FETCH_INSTANCE = new fetchClient_1.FetchClient();


/***/ }),

/***/ 4144:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AxisProvider = void 0;
const axios_1 = __nccwpck_require__(8577);
class AxisProvider {
    constructor() {
        this.pendingRequests = 0;
        this.axios = axios_1.default.create({});
        this.configureRequest();
        this.configureResponse();
    }
    configureRequest() {
        this.axios.interceptors.request.use(config => {
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (this.pendingRequests < AxisProvider.CROWDIN_API_MAX_CONCURRENT_REQUESTS) {
                        this.pendingRequests++;
                        clearInterval(interval);
                        resolve(config);
                    }
                }, AxisProvider.CROWDIN_API_REQUESTS_INTERVAL_MS);
            });
        });
    }
    configureResponse() {
        this.axios.interceptors.response.use(response => {
            this.pendingRequests = Math.max(0, this.pendingRequests - 1);
            return Promise.resolve(response.data);
        }, error => {
            this.pendingRequests = Math.max(0, this.pendingRequests - 1);
            if (!!error.response && !!error.response.data) {
                if (error.response.status === 400) {
                    return Promise.reject(error.response.data);
                }
                else {
                    return Promise.reject(error.response.data);
                }
            }
            else {
                const errorCode = (error.response && error.response.status) || '500';
                const defaultError = {
                    error: {
                        code: errorCode,
                        message: `Request failed. ${error}`,
                    },
                };
                return Promise.reject(defaultError);
            }
        });
    }
}
exports.AxisProvider = AxisProvider;
AxisProvider.CROWDIN_API_MAX_CONCURRENT_REQUESTS = 15;
AxisProvider.CROWDIN_API_REQUESTS_INTERVAL_MS = 10;


/***/ }),

/***/ 3319:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FetchClient = void 0;
class FetchClient {
    constructor() {
        this.maxConcurrentRequests = 15;
        this.requestIntervalMs = 10;
        this.pendingRequests = 0;
    }
    get(url, config) {
        return this.request(url, 'GET', config);
    }
    delete(url, config) {
        return this.request(url, 'DELETE', config);
    }
    head(url, config) {
        return this.request(url, 'HEAD', config);
    }
    post(url, data, config) {
        return this.request(url, 'POST', config, data);
    }
    put(url, data, config) {
        return this.request(url, 'PUT', config, data);
    }
    patch(url, data, config) {
        return this.request(url, 'PATCH', config, data);
    }
    request(url, method, config, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let body = undefined;
            if (!!data) {
                if (typeof data === 'object' && !this.isBuffer(data)) {
                    body = JSON.stringify(data);
                    config = config || { headers: {} };
                    config.headers = config.headers || {};
                    config.headers['Content-Type'] = 'application/json';
                }
                else {
                    body = data;
                }
            }
            yield this.waitInQueue();
            return fetch(url, {
                method: method,
                headers: !!config ? config.headers : {},
                mode: (config && config.mode) || 'no-cors',
                body: body,
            })
                .then((resp) => __awaiter(this, void 0, void 0, function* () {
                if (resp.status === 204) {
                    return {};
                }
                const text = yield resp.text();
                const json = text ? JSON.parse(text) : {};
                if (resp.status >= 200 && resp.status < 300) {
                    return json;
                }
                else {
                    throw json;
                }
            }))
                .finally(() => (this.pendingRequests = Math.max(0, this.pendingRequests - 1)));
        });
    }
    isBuffer(data) {
        if (typeof ArrayBuffer === 'function') {
            return ArrayBuffer.isView(data);
        }
        else if (typeof Buffer === 'function') {
            return Buffer.isBuffer(data);
        }
        else {
            return false;
        }
    }
    waitInQueue() {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (this.pendingRequests < this.maxConcurrentRequests) {
                    this.pendingRequests++;
                    clearInterval(interval);
                    resolve();
                }
            }, this.requestIntervalMs);
        });
    }
}
exports.FetchClient = FetchClient;


/***/ }),

/***/ 9359:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RetryService = void 0;
class RetryService {
    constructor(config) {
        this.config = config;
    }
    /**
     *
     * @param func function to execute
     */
    executeAsyncFunc(func) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i <= this.config.retries; i++) {
                try {
                    const result = yield func();
                    return result;
                }
                catch (error) {
                    const skip = this.config.conditions.map(condition => condition.test(error)).find(skip => skip === true);
                    if (skip || i === this.config.retries) {
                        throw error;
                    }
                    yield this.wait();
                }
            }
            throw new Error('Wrong retry configuration. Failed to retrieve value.');
        });
    }
    /**
     *
     * @param func function to execute
     */
    executeSyncFunc(func) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i <= this.config.retries; i++) {
                try {
                    const result = func();
                    return result;
                }
                catch (error) {
                    const skip = this.config.conditions.map(condition => condition.test(error)).find(skip => skip === true);
                    if (skip || i === this.config.retries) {
                        throw error;
                    }
                    yield this.wait();
                }
            }
            throw new Error('Wrong retry configuration. Failed to retrieve value.');
        });
    }
    wait() {
        return new Promise((res) => {
            setTimeout(() => res(), this.config.waitInterval);
        });
    }
}
exports.RetryService = RetryService;


/***/ }),

/***/ 1228:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dictionaries = void 0;
const core_1 = __nccwpck_require__(4735);
class Dictionaries extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param languageIds filter progress by Language Identifiers
     */
    listDictionaries(projectId, languageIds) {
        let url = `${this.url}/projects/${projectId}/dictionaries`;
        url = this.addQueryParam(url, 'languageIds', languageIds);
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param languageId language identifier
     * @param request request body
     */
    editDictionary(projectId, languageId, request) {
        const url = `${this.url}/projects/${projectId}/dictionaries/${languageId}`;
        return this.patch(url, request, this.defaultConfig());
    }
}
exports.Dictionaries = Dictionaries;


/***/ }),

/***/ 2791:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Distributions = void 0;
const core_1 = __nccwpck_require__(4735);
class Distributions extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listDistributions(projectId, limit, offset) {
        const url = `${this.url}/projects/${projectId}/distributions`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    createDistribution(projectId, request) {
        const url = `${this.url}/projects/${projectId}/distributions`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param hash hash
     */
    getDistribution(projectId, hash) {
        const url = `${this.url}/projects/${projectId}/distributions/${hash}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param hash hash
     */
    deleteDistribution(projectId, hash) {
        const url = `${this.url}/projects/${projectId}/distributions/${hash}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param hash hash
     * @param request request body
     */
    editDistribution(projectId, hash, request) {
        const url = `${this.url}/projects/${projectId}/distributions/${hash}`;
        return this.patch(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param hash hash
     */
    getDistributionRelease(projectId, hash) {
        const url = `${this.url}/projects/${projectId}/distributions/${hash}/release`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param hash hash
     * @param request request body
     */
    createDistributionRelease(projectId, hash) {
        const url = `${this.url}/projects/${projectId}/distributions/${hash}/release`;
        return this.post(url, {}, this.defaultConfig());
    }
}
exports.Distributions = Distributions;


/***/ }),

/***/ 7955:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GlossariesModel = exports.Glossaries = void 0;
const core_1 = __nccwpck_require__(4735);
class Glossaries extends core_1.CrowdinApi {
    /**
     * @param groupId group identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listGlossaries(groupId, limit, offset) {
        let url = `${this.url}/glossaries`;
        url = this.addQueryParam(url, 'groupId', groupId);
        return this.getList(url, limit, offset);
    }
    /**
     * @param request request body
     */
    addGlossary(request) {
        const url = `${this.url}/glossaries`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     */
    getGlossary(glossaryId) {
        const url = `${this.url}/glossaries/${glossaryId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     */
    deleteGlossary(glossaryId) {
        const url = `${this.url}/glossaries/${glossaryId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     * @param request request body
     */
    editGlossary(glossaryId, request) {
        const url = `${this.url}/glossaries/${glossaryId}`;
        return this.patch(url, request, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     * @param request request body
     */
    exportGlossary(glossaryId, request) {
        const url = `${this.url}/glossaries/${glossaryId}/exports`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     * @param exportId export identifier
     */
    downloadGlossary(glossaryId, exportId) {
        const url = `${this.url}/glossaries/${glossaryId}/exports/${exportId}/download`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     * @param exportId export identifier
     */
    checkGlossaryExportStatus(glossaryId, exportId) {
        const url = `${this.url}/glossaries/${glossaryId}/exports/${exportId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     * @param request request body
     */
    importGlossaryFile(glossaryId, request) {
        const url = `${this.url}/glossaries/${glossaryId}/imports`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     * @param importId import identifier
     */
    checkGlossaryImportStatus(glossaryId, importId) {
        const url = `${this.url}/glossaries/${glossaryId}/imports/${importId}`;
        return this.get(url, this.defaultConfig());
    }
    listTerms(glossaryId, userIdOrRequest, limit, offset, languageId, translationOfTermId) {
        let url = `${this.url}/glossaries/${glossaryId}/terms`;
        let request;
        if (userIdOrRequest && typeof userIdOrRequest === 'object') {
            request = userIdOrRequest;
        }
        else {
            request = { userId: userIdOrRequest, limit, offset, languageId, translationOfTermId };
        }
        url = this.addQueryParam(url, 'userId', request.userId);
        url = this.addQueryParam(url, 'languageId', request.languageId);
        url = this.addQueryParam(url, 'translationOfTermId', request.translationOfTermId);
        return this.getList(url, request.limit, request.offset);
    }
    /**
     * @param glossaryId glossary identifier
     * @param request request body
     */
    addTerm(glossaryId, request) {
        const url = `${this.url}/glossaries/${glossaryId}/terms`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     * @param languageId languageId identifier
     * @param translationOfTermId term translation identifier
     */
    clearGlossary(glossaryId, languageId, translationOfTermId) {
        let url = `${this.url}/glossaries/${glossaryId}/terms`;
        url = this.addQueryParam(url, 'languageId', languageId);
        url = this.addQueryParam(url, 'translationOfTermId', translationOfTermId);
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     * @param termId term identifier
     */
    getTerm(glossaryId, termId) {
        const url = `${this.url}/glossaries/${glossaryId}/terms/${termId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     * @param termId term identifier
     */
    deleteTerm(glossaryId, termId) {
        const url = `${this.url}/glossaries/${glossaryId}/terms/${termId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param glossaryId glossary identifier
     * @param termId term identifier
     * @param request request body
     */
    editTerm(glossaryId, termId, request) {
        const url = `${this.url}/glossaries/${glossaryId}/terms/${termId}`;
        return this.patch(url, request, this.defaultConfig());
    }
}
exports.Glossaries = Glossaries;
var GlossariesModel;
(function (GlossariesModel) {
    let GlossaryFormat;
    (function (GlossaryFormat) {
        GlossaryFormat["TBX"] = "tbx";
        GlossaryFormat["CSV"] = "csv";
        GlossaryFormat["XLSX"] = "xlsx";
    })(GlossaryFormat = GlossariesModel.GlossaryFormat || (GlossariesModel.GlossaryFormat = {}));
    let PartOfSpeech;
    (function (PartOfSpeech) {
        PartOfSpeech["ADJECTIVE"] = "adjective";
        PartOfSpeech["ADPOSITION"] = "adposition";
        PartOfSpeech["ADVERB"] = "adverb";
        PartOfSpeech["AUXILIARY"] = "auxiliary";
        PartOfSpeech["COORDINATING_CONJUNCTION"] = "coordinating conjunction";
        PartOfSpeech["DETERMINER"] = "determiner";
        PartOfSpeech["INTERJECTION"] = "interjection";
        PartOfSpeech["NOUN"] = "noun";
        PartOfSpeech["NUMERAL"] = "numeral";
        PartOfSpeech["PARTICLE"] = "particle";
        PartOfSpeech["PRONOUN"] = "pronoun";
        PartOfSpeech["PROPER_NOUN"] = "proper noun";
        PartOfSpeech["SUBORDINATING_CONJUNCTION"] = "subordinating conjunction";
        PartOfSpeech["VERB"] = "verb";
        PartOfSpeech["OTHER"] = "other";
    })(PartOfSpeech = GlossariesModel.PartOfSpeech || (GlossariesModel.PartOfSpeech = {}));
})(GlossariesModel = exports.GlossariesModel || (exports.GlossariesModel = {}));


/***/ }),

/***/ 5085:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const dictionaries_1 = __nccwpck_require__(1228);
const distributions_1 = __nccwpck_require__(2791);
const glossaries_1 = __nccwpck_require__(7955);
const issues_1 = __nccwpck_require__(2744);
const labels_1 = __nccwpck_require__(1355);
const languages_1 = __nccwpck_require__(4183);
const machineTranslation_1 = __nccwpck_require__(4038);
const projectsGroups_1 = __nccwpck_require__(8898);
const reports_1 = __nccwpck_require__(2814);
const screenshots_1 = __nccwpck_require__(8170);
const sourceFiles_1 = __nccwpck_require__(9487);
const sourceStrings_1 = __nccwpck_require__(2948);
const stringComments_1 = __nccwpck_require__(2901);
const stringTranslations_1 = __nccwpck_require__(4009);
const tasks_1 = __nccwpck_require__(9273);
const teams_1 = __nccwpck_require__(3436);
const translationMemory_1 = __nccwpck_require__(2757);
const translations_1 = __nccwpck_require__(7637);
const translationStatus_1 = __nccwpck_require__(7658);
const uploadStorage_1 = __nccwpck_require__(4976);
const users_1 = __nccwpck_require__(4374);
const vendors_1 = __nccwpck_require__(4315);
const webhooks_1 = __nccwpck_require__(4596);
const workflows_1 = __nccwpck_require__(2906);
__exportStar(__nccwpck_require__(4735), exports);
__exportStar(__nccwpck_require__(1228), exports);
__exportStar(__nccwpck_require__(2791), exports);
__exportStar(__nccwpck_require__(7955), exports);
__exportStar(__nccwpck_require__(2744), exports);
__exportStar(__nccwpck_require__(1355), exports);
__exportStar(__nccwpck_require__(4183), exports);
__exportStar(__nccwpck_require__(4038), exports);
__exportStar(__nccwpck_require__(8898), exports);
__exportStar(__nccwpck_require__(2814), exports);
__exportStar(__nccwpck_require__(8170), exports);
__exportStar(__nccwpck_require__(9487), exports);
__exportStar(__nccwpck_require__(2948), exports);
__exportStar(__nccwpck_require__(2901), exports);
__exportStar(__nccwpck_require__(4009), exports);
__exportStar(__nccwpck_require__(9273), exports);
__exportStar(__nccwpck_require__(3436), exports);
__exportStar(__nccwpck_require__(2757), exports);
__exportStar(__nccwpck_require__(7637), exports);
__exportStar(__nccwpck_require__(7658), exports);
__exportStar(__nccwpck_require__(4976), exports);
__exportStar(__nccwpck_require__(4374), exports);
__exportStar(__nccwpck_require__(4315), exports);
__exportStar(__nccwpck_require__(4596), exports);
__exportStar(__nccwpck_require__(2906), exports);
class Client {
    constructor(credentials, config) {
        this.sourceFilesApi = new sourceFiles_1.SourceFiles(credentials, config);
        this.glossariesApi = new glossaries_1.Glossaries(credentials, config);
        this.languagesApi = new languages_1.Languages(credentials, config);
        this.translationsApi = new translations_1.Translations(credentials, config);
        this.translationStatusApi = new translationStatus_1.TranslationStatus(credentials, config);
        this.projectsGroupsApi = new projectsGroups_1.ProjectsGroups(credentials, config);
        this.reportsApi = new reports_1.Reports(credentials, config);
        this.screenshotsApi = new screenshots_1.Screenshots(credentials, config);
        this.sourceStringsApi = new sourceStrings_1.SourceStrings(credentials, config);
        this.uploadStorageApi = new uploadStorage_1.UploadStorage(credentials, config);
        this.tasksApi = new tasks_1.Tasks(credentials, config);
        this.translationMemoryApi = new translationMemory_1.TranslationMemory(credentials, config);
        this.webhooksApi = new webhooks_1.Webhooks(credentials, config);
        this.machineTranslationApi = new machineTranslation_1.MachineTranslation(credentials, config);
        this.stringTranslationsApi = new stringTranslations_1.StringTranslations(credentials, config);
        this.workflowsApi = new workflows_1.Workflows(credentials, config);
        this.usersApi = new users_1.Users(credentials, config);
        this.vendorsApi = new vendors_1.Vendors(credentials, config);
        this.issuesApi = new issues_1.Issues(credentials, config);
        this.teamsApi = new teams_1.Teams(credentials, config);
        this.distributionsApi = new distributions_1.Distributions(credentials, config);
        this.dictionariesApi = new dictionaries_1.Dictionaries(credentials, config);
        this.labelsApi = new labels_1.Labels(credentials, config);
        this.stringCommentsApi = new stringComments_1.StringComments(credentials, config);
    }
}
exports.default = Client;


/***/ }),

/***/ 2744:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IssuesModel = exports.Issues = void 0;
const core_1 = __nccwpck_require__(4735);
/**
 * @deprecated
 */
class Issues extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     * @param type defines the issue type
     * @param status defines the issue resolution status
     */
    listReportedIssues(projectId, limit, offset, type, status) {
        let url = `${this.url}/projects/${projectId}/issues`;
        url = this.addQueryParam(url, 'type', type);
        url = this.addQueryParam(url, 'status', status);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param issueId issue identifier
     * @param request request body
     */
    editIssue(projectId, issueId, request) {
        const url = `${this.url}/projects/${projectId}/issues/${issueId}`;
        return this.patch(url, request, this.defaultConfig());
    }
}
exports.Issues = Issues;
/**
 * @deprecated
 */
var IssuesModel;
(function (IssuesModel) {
    let Type;
    (function (Type) {
        Type["ALL"] = "all";
        Type["GENERAL_QUESTION"] = "general_question";
        Type["TRANSLATION_MISTAKE"] = "translation_mistake";
        Type["CONTEXT_REQUEST"] = "context_request";
        Type["SOURCE_MISTAKE"] = "source_mistake";
    })(Type = IssuesModel.Type || (IssuesModel.Type = {}));
    let Status;
    (function (Status) {
        Status["ALL"] = "all";
        Status["RESOLVED"] = "resolved";
        Status["UNRESOLVED"] = "unresolved";
    })(Status = IssuesModel.Status || (IssuesModel.Status = {}));
})(IssuesModel = exports.IssuesModel || (exports.IssuesModel = {}));


/***/ }),

/***/ 1355:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Labels = void 0;
const core_1 = __nccwpck_require__(4735);
class Labels extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listLabels(projectId, limit, offset) {
        const url = `${this.url}/projects/${projectId}/labels`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    addLabel(projectId, request) {
        const url = `${this.url}/projects/${projectId}/labels`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param labelId label identifier
     */
    getLabel(projectId, labelId) {
        const url = `${this.url}/projects/${projectId}/labels/${labelId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param labelId label identifier
     */
    deleteLabel(projectId, labelId) {
        const url = `${this.url}/projects/${projectId}/labels/${labelId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param labelId label identifier
     * @param request request body
     */
    editLabel(projectId, labelId, request) {
        const url = `${this.url}/projects/${projectId}/labels/${labelId}`;
        return this.patch(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param labelId label identifier
     * @param request request body
     */
    assignLabelToString(projectId, labelId, request) {
        const url = `${this.url}/projects/${projectId}/labels/${labelId}/strings`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param labelId label identifier
     * @param stringIds string identifiers
     */
    unassignLabelFromString(projectId, labelId, stringIds) {
        let url = `${this.url}/projects/${projectId}/labels/${labelId}/strings`;
        url = this.addQueryParam(url, 'stringIds', stringIds);
        return this.delete(url, this.defaultConfig());
    }
}
exports.Labels = Labels;


/***/ }),

/***/ 4183:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LanguagesModel = exports.Languages = void 0;
const core_1 = __nccwpck_require__(4735);
class Languages extends core_1.CrowdinApi {
    /**
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listSupportedLanguages(limit, offset) {
        const url = `${this.url}/languages`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param request request body
     */
    addCustomLanguage(request) {
        const url = `${this.url}/languages`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param languageId language identifier
     */
    getLanguage(languageId) {
        const url = `${this.url}/languages/${languageId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param languageId language identifier
     */
    deleteCustomLanguage(languageId) {
        const url = `${this.url}/languages/${languageId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param languageId language identifier
     * @param request request body
     */
    editCustomLanguage(languageId, request) {
        const url = `${this.url}/languages/${languageId}`;
        return this.patch(url, request, this.defaultConfig());
    }
}
exports.Languages = Languages;
var LanguagesModel;
(function (LanguagesModel) {
    let TextDirection;
    (function (TextDirection) {
        TextDirection["LTR"] = "ltr";
        TextDirection["RTL"] = "rtl";
    })(TextDirection = LanguagesModel.TextDirection || (LanguagesModel.TextDirection = {}));
})(LanguagesModel = exports.LanguagesModel || (exports.LanguagesModel = {}));


/***/ }),

/***/ 4038:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MachineTranslation = void 0;
const core_1 = __nccwpck_require__(4735);
class MachineTranslation extends core_1.CrowdinApi {
    /**
     * @param groupId group identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listMts(groupId, limit, offset) {
        let url = `${this.url}/mts`;
        url = this.addQueryParam(url, 'groupId', groupId);
        return this.getList(url, limit, offset);
    }
    /**
     * @param request request body
     */
    createMt(request) {
        const url = `${this.url}/mts`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param mtId mt identifier
     */
    getMt(mtId) {
        const url = `${this.url}/mts/${mtId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param mtId mt identifier
     */
    deleteMt(mtId) {
        const url = `${this.url}/mts/${mtId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param mtId mt identifier
     * @param request request body
     */
    updateMt(mtId, request) {
        const url = `${this.url}/mts/${mtId}`;
        return this.patch(url, request, this.defaultConfig());
    }
}
exports.MachineTranslation = MachineTranslation;


/***/ }),

/***/ 8898:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProjectsGroupsModel = exports.ProjectsGroups = void 0;
const core_1 = __nccwpck_require__(4735);
class ProjectsGroups extends core_1.CrowdinApi {
    /**
     * @param parentId parent group identifier
     * @param offset starting offset in the collection (default 0)
     * @param userId get user own projects
     * @param limit maximum number of items to retrieve (default 25)
     */
    listGroups(parentId, offset, userId, limit) {
        let url = `${this.url}/groups`;
        url = this.addQueryParam(url, 'parentId', parentId);
        url = this.addQueryParam(url, 'userId', userId);
        return this.getList(url, limit, offset);
    }
    /**
     * @param request request body
     */
    addGroup(request) {
        const url = `${this.url}/groups`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param group group identifier
     */
    getGroup(groupId) {
        const url = `${this.url}/groups/${groupId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param groupId group identifier
     */
    deleteGroup(groupId) {
        const url = `${this.url}/groups/${groupId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param groupId group identifier
     * @param request request body
     */
    editGroup(groupId, request) {
        const url = `${this.url}/groups/${groupId}`;
        return this.patch(url, request, this.defaultConfig());
    }
    /**
     * @param groupId group identifier
     * @param hasManagerAccess projects with manager access (default 0)
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listProjects(groupId, hasManagerAccess, limit, offset) {
        let url = `${this.url}/projects`;
        url = this.addQueryParam(url, 'groupId', groupId);
        url = this.addQueryParam(url, 'hasManagerAccess', hasManagerAccess);
        return this.getList(url, limit, offset);
    }
    /**
     * @param request request body
     */
    addProject(request) {
        const url = `${this.url}/projects`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     */
    getProject(projectId) {
        const url = `${this.url}/projects/${projectId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     */
    deleteProject(projectId) {
        const url = `${this.url}/projects/${projectId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    editProject(projectId, request) {
        const url = `${this.url}/projects/${projectId}`;
        return this.patch(url, request, this.defaultConfig());
    }
}
exports.ProjectsGroups = ProjectsGroups;
var ProjectsGroupsModel;
(function (ProjectsGroupsModel) {
    let Type;
    (function (Type) {
        Type[Type["FILES_BASED"] = 0] = "FILES_BASED";
        Type[Type["STRINGS_BASED"] = 1] = "STRINGS_BASED";
    })(Type = ProjectsGroupsModel.Type || (ProjectsGroupsModel.Type = {}));
    let JoinPolicy;
    (function (JoinPolicy) {
        JoinPolicy["OPEN"] = "open";
        JoinPolicy["PRIVATE"] = "private";
    })(JoinPolicy = ProjectsGroupsModel.JoinPolicy || (ProjectsGroupsModel.JoinPolicy = {}));
    let LanguageAccessPolicy;
    (function (LanguageAccessPolicy) {
        LanguageAccessPolicy["OPEN"] = "open";
        LanguageAccessPolicy["MODERATE"] = "moderate";
    })(LanguageAccessPolicy = ProjectsGroupsModel.LanguageAccessPolicy || (ProjectsGroupsModel.LanguageAccessPolicy = {}));
    let TranslateDuplicates;
    (function (TranslateDuplicates) {
        TranslateDuplicates[TranslateDuplicates["SHOW"] = 0] = "SHOW";
        TranslateDuplicates[TranslateDuplicates["HIDE_REGULAR_DETECTION"] = 1] = "HIDE_REGULAR_DETECTION";
        TranslateDuplicates[TranslateDuplicates["SHOW_AUTO_TRANSLATE"] = 2] = "SHOW_AUTO_TRANSLATE";
        TranslateDuplicates[TranslateDuplicates["SHOW_WITHIN_VERION_BRANCH_REGULAR_DETECTION"] = 3] = "SHOW_WITHIN_VERION_BRANCH_REGULAR_DETECTION";
        TranslateDuplicates[TranslateDuplicates["HIDE_STRICT_DETECTION"] = 4] = "HIDE_STRICT_DETECTION";
        TranslateDuplicates[TranslateDuplicates["SHOW_WITHIN_VERION_BRANCH_STRICT_DETECTION"] = 5] = "SHOW_WITHIN_VERION_BRANCH_STRICT_DETECTION";
    })(TranslateDuplicates = ProjectsGroupsModel.TranslateDuplicates || (ProjectsGroupsModel.TranslateDuplicates = {}));
})(ProjectsGroupsModel = exports.ProjectsGroupsModel || (exports.ProjectsGroupsModel = {}));


/***/ }),

/***/ 2814:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReportsModel = exports.Reports = void 0;
const core_1 = __nccwpck_require__(4735);
class Reports extends core_1.CrowdinApi {
    /**
     * @param groupId group identifier
     * @param request request body
     */
    generateGroupReport(groupId, request) {
        const url = `${this.url}/groups/${groupId}/reports`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param groupId group identifier
     * @param reportId report identifier
     */
    checkGroupReportStatus(groupId, reportId) {
        const url = `${this.url}/groups/${groupId}/reports/${reportId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param groupId group identifier
     * @param reportId report identifier
     */
    downloadGroupReport(groupId, reportId) {
        const url = `${this.url}/groups/${groupId}/reports/${reportId}/download`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param request request body
     */
    generateOrganizationReport(request) {
        const url = `${this.url}/reports`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param reportId report identifier
     */
    checkOrganizationReportStatus(reportId) {
        const url = `${this.url}/reports/${reportId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param reportId report identifier
     */
    downloadOrganizationReport(reportId) {
        const url = `${this.url}/reports/${reportId}/download`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    generateReport(projectId, request) {
        const url = `${this.url}/projects/${projectId}/reports`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param reportId report identifier
     */
    checkReportStatus(projectId, reportId) {
        const url = `${this.url}/projects/${projectId}/reports/${reportId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param reportId report identifier
     */
    downloadReport(projectId, reportId) {
        const url = `${this.url}/projects/${projectId}/reports/${reportId}/download`;
        return this.get(url, this.defaultConfig());
    }
}
exports.Reports = Reports;
var ReportsModel;
(function (ReportsModel) {
    let Unit;
    (function (Unit) {
        Unit["STRINGS"] = "strings";
        Unit["WORDS"] = "words";
        Unit["CHARS"] = "chars";
        Unit["CHARS_WITH_SPACES"] = "chars_with_spaces";
    })(Unit = ReportsModel.Unit || (ReportsModel.Unit = {}));
    let Currency;
    (function (Currency) {
        Currency["USD"] = "USD";
        Currency["EUR"] = "EUR";
        Currency["JPY"] = "JPY";
        Currency["GBP"] = "GBP";
        Currency["AUD"] = "AUD";
        Currency["CAD"] = "CAD";
        Currency["CHF"] = "CHF";
        Currency["CNY"] = "CNY";
        Currency["SEK"] = "SEK";
        Currency["NZD"] = "NZD";
        Currency["MXN"] = "MXN";
        Currency["SGD"] = "SGD";
        Currency["HKD"] = "HKD";
        Currency["NOK"] = "NOK";
        Currency["KRW"] = "KRW";
        Currency["TRY"] = "TRY";
        Currency["RUB"] = "RUB";
        Currency["INR"] = "INR";
        Currency["BRL"] = "BRL";
        Currency["ZAR"] = "ZAR";
        Currency["GEL"] = "GEL";
        Currency["UAH"] = "UAH";
    })(Currency = ReportsModel.Currency || (ReportsModel.Currency = {}));
    let Format;
    (function (Format) {
        Format["XLSX"] = "xlsx";
        Format["CSV"] = "csv";
        Format["JSON"] = "json";
    })(Format = ReportsModel.Format || (ReportsModel.Format = {}));
    let Mode;
    (function (Mode) {
        Mode["NO_MATCH"] = "no_match";
        Mode["TM_MATCH"] = "tm_match";
        Mode["APPROVAL"] = "approval";
    })(Mode = ReportsModel.Mode || (ReportsModel.Mode = {}));
    let ContributionMode;
    (function (ContributionMode) {
        ContributionMode["TRANSLATIONS"] = "translations";
        ContributionMode["APPROVALS"] = "approvals";
        ContributionMode["VOTES"] = "votes";
    })(ContributionMode = ReportsModel.ContributionMode || (ReportsModel.ContributionMode = {}));
    let GroupBy;
    (function (GroupBy) {
        GroupBy["USER"] = "user";
        GroupBy["LANGUAGE"] = "language";
    })(GroupBy = ReportsModel.GroupBy || (ReportsModel.GroupBy = {}));
})(ReportsModel = exports.ReportsModel || (exports.ReportsModel = {}));


/***/ }),

/***/ 8170:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Screenshots = void 0;
const core_1 = __nccwpck_require__(4735);
class Screenshots extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listScreenshots(projectId, limit, offset) {
        const url = `${this.url}/projects/${projectId}/screenshots`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    addScreenshot(projectId, request) {
        const url = `${this.url}/projects/${projectId}/screenshots`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param screenshotId screenshot identifier
     */
    getScreenshot(projectId, screenshotId) {
        const url = `${this.url}/projects/${projectId}/screenshots/${screenshotId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param screenshotId screenshot identifier
     * @param request request body
     */
    updateScreenshot(projectId, screenshotId, request) {
        const url = `${this.url}/projects/${projectId}/screenshots/${screenshotId}`;
        return this.put(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param screenshotId screenshot identifier
     */
    deleteScreenshot(projectId, screenshotId) {
        const url = `${this.url}/projects/${projectId}/screenshots/${screenshotId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param screenshotId screenshot identifier
     * @param request request body
     */
    editScreenshot(projectId, screenshotId, request) {
        const url = `${this.url}/projects/${projectId}/screenshots/${screenshotId}`;
        return this.patch(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param screenshotId screenshot identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listScreenshotTags(projectId, screenshotId, limit, offset) {
        const url = `${this.url}/projects/${projectId}/screenshots/${screenshotId}/tags`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param screenshotId screenshot identifier
     * @param request request body
     */
    replaceTags(projectId, screenshotId, request) {
        const url = `${this.url}/projects/${projectId}/screenshots/${screenshotId}/tags`;
        return this.put(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param screenshotId screenshot identifier
     * @param request request body
     */
    addTag(projectId, screenshotId, request) {
        const url = `${this.url}/projects/${projectId}/screenshots/${screenshotId}/tags`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param screenshotId screenshot identifier
     */
    clearTags(projectId, screenshotId) {
        const url = `${this.url}/projects/${projectId}/screenshots/${screenshotId}/tags`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param screenshotId screenshot identifier
     * @param tagId tag identifier
     */
    getTag(projectId, screenshotId, tagId) {
        const url = `${this.url}/projects/${projectId}/screenshots/${screenshotId}/tags/${tagId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param screenshotId screenshot identifier
     * @param tagId tag identifier
     */
    deleteTag(projectId, screenshotId, tagId) {
        const url = `${this.url}/projects/${projectId}/screenshots/${screenshotId}/tags/${tagId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param screenshotId screenshot identifier
     * @param tagId tag identifier
     * @param request request body
     */
    updateTag(projectId, screenshotId, tagId, request) {
        const url = `${this.url}/projects/${projectId}/screenshots/${screenshotId}/tags/${tagId}`;
        return this.patch(url, request, this.defaultConfig());
    }
}
exports.Screenshots = Screenshots;


/***/ }),

/***/ 9487:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SourceFilesModel = exports.SourceFiles = void 0;
const core_1 = __nccwpck_require__(4735);
class SourceFiles extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param name filter branch by name
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listProjectBranches(projectId, name, limit, offset) {
        let url = `${this.url}/projects/${projectId}/branches`;
        url = this.addQueryParam(url, 'name', name);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    createBranch(projectId, request) {
        const url = `${this.url}/projects/${projectId}/branches`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param branchId branch identifier
     */
    getBranch(projectId, branchId) {
        const url = `${this.url}/projects/${projectId}/branches/${branchId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param branchId branch identifier
     */
    deleteBranch(projectId, branchId) {
        const url = `${this.url}/projects/${projectId}/branches/${branchId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param branchId branch identifier
     * @param request request body
     */
    editBranch(projectId, branchId, request) {
        const url = `${this.url}/projects/${projectId}/branches/${branchId}`;
        return this.patch(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param branchId filter directories by branchId
     * @param directoryId filter directories by directoryId
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listProjectDirectories(projectId, branchId, directoryId, limit, offset) {
        let url = `${this.url}/projects/${projectId}/directories`;
        url = this.addQueryParam(url, 'branchId', branchId);
        url = this.addQueryParam(url, 'directoryId', directoryId);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    createDirectory(projectId, request) {
        const url = `${this.url}/projects/${projectId}/directories`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param directoryId directory identifier
     */
    getDirectory(projectId, directoryId) {
        const url = `${this.url}/projects/${projectId}/directories/${directoryId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param directoryId directory identifier
     */
    deleteDirectory(projectId, directoryId) {
        const url = `${this.url}/projects/${projectId}/directories/${directoryId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param directoryId directory identifier
     * @param request request body
     */
    editDirectory(projectId, directoryId, request) {
        const url = `${this.url}/projects/${projectId}/directories/${directoryId}`;
        return this.patch(url, request, this.defaultConfig());
    }
    listProjectFiles(projectId, branchIdOrRequest, directoryId, limit, offset, recursion, filter) {
        let url = `${this.url}/projects/${projectId}/files`;
        let request;
        if (branchIdOrRequest && typeof branchIdOrRequest === 'object') {
            request = branchIdOrRequest;
        }
        else {
            request = { branchId: branchIdOrRequest, directoryId, limit, offset, recursion, filter };
        }
        url = this.addQueryParam(url, 'branchId', request.branchId);
        url = this.addQueryParam(url, 'directoryId', request.directoryId);
        url = this.addQueryParam(url, 'recursion', request.recursion);
        url = this.addQueryParam(url, 'filter', request.filter);
        return this.getList(url, request.limit, request.offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    createFile(projectId, request) {
        const url = `${this.url}/projects/${projectId}/files`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param fileId file identifier
     */
    getFile(projectId, fileId) {
        const url = `${this.url}/projects/${projectId}/files/${fileId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param fileId file identifier
     * @param request request body
     */
    updateOrRestoreFile(projectId, fileId, request) {
        const url = `${this.url}/projects/${projectId}/files/${fileId}`;
        return this.put(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param fileId file identifier
     */
    deleteFile(projectId, fileId) {
        const url = `${this.url}/projects/${projectId}/files/${fileId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param fileId file identifier
     * @param request request body
     */
    editFile(projectId, fileId, request) {
        const url = `${this.url}/projects/${projectId}/files/${fileId}`;
        return this.patch(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param fileId file identifier
     */
    downloadFile(projectId, fileId) {
        const url = `${this.url}/projects/${projectId}/files/${fileId}/download`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param fileId file identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listFileRevisions(projectId, fileId, limit, offset) {
        const url = `${this.url}/projects/${projectId}/files/${fileId}/revisions`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param fileId file identifier
     * @param revisionId revision identifier
     */
    getFileRevision(projectId, fileId, revisionId) {
        const url = `${this.url}/projects/${projectId}/files/${fileId}/revisions/${revisionId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param branchId filter builds by branchId
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listReviewedSourceFilesBuild(projectId, branchId, limit, offset) {
        let url = `${this.url}/projects/${projectId}/strings/reviewed-builds`;
        url = this.addQueryParam(url, 'branchId', branchId);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    buildReviewedSourceFiles(projectId, request) {
        const url = `${this.url}/projects/${projectId}/strings/reviewed-builds`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param buildId build identifier
     */
    checkReviewedSourceFilesBuildStatus(projectId, buildId) {
        const url = `${this.url}/projects/${projectId}/strings/reviewed-builds/${buildId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param buildId build identifier
     */
    downloadReviewedSourceFiles(projectId, buildId) {
        const url = `${this.url}/projects/${projectId}/strings/reviewed-builds/${buildId}/download`;
        return this.get(url, this.defaultConfig());
    }
}
exports.SourceFiles = SourceFiles;
var SourceFilesModel;
(function (SourceFilesModel) {
    let Priority;
    (function (Priority) {
        Priority["LOW"] = "low";
        Priority["NORMAL"] = "normal";
        Priority["HIGH"] = "high";
    })(Priority = SourceFilesModel.Priority || (SourceFilesModel.Priority = {}));
    let FileType;
    (function (FileType) {
        FileType["AUTO"] = "auto";
        FileType["ANDROID"] = "android";
        FileType["MACOSX"] = "macosx";
        FileType["RESX"] = "resx";
        FileType["PROPERTIES"] = "properties";
        FileType["GETTEXT"] = "gettext";
        FileType["YAML"] = "yaml";
        FileType["PHP"] = "php";
        FileType["JSON"] = "json";
        FileType["XML"] = "xml";
        FileType["INI"] = "ini";
        FileType["RC"] = "rc";
        FileType["RESW"] = "resw";
        FileType["RESJSON"] = "resjson";
        FileType["QTTS"] = "qtts";
        FileType["JOOMLA"] = "joomla";
        FileType["CHROME"] = "chrome";
        FileType["DTD"] = "dtd";
        FileType["DKLANG"] = "dklang";
        FileType["FLEX"] = "flex";
        FileType["NSH"] = "nsh";
        FileType["WXL"] = "wxl";
        FileType["XLIFF"] = "xliff";
        FileType["HTML"] = "html";
        FileType["HAML"] = "haml";
        FileType["TXT"] = "txt";
        FileType["CSV"] = "csv";
        FileType["MD"] = "md";
        FileType["FLSNP"] = "flsnp";
        FileType["FM_HTML"] = "fm_html";
        FileType["FM_MD"] = "fm_md";
        FileType["MEDIAWIKI"] = "mediawiki";
        FileType["DOCX"] = "docx";
        FileType["SBV"] = "sbv";
        FileType["VTT"] = "vtt";
        FileType["SRT"] = "srt";
    })(FileType = SourceFilesModel.FileType || (SourceFilesModel.FileType = {}));
    let EscapeQuotes;
    (function (EscapeQuotes) {
        EscapeQuotes[EscapeQuotes["ZERO"] = 0] = "ZERO";
        EscapeQuotes[EscapeQuotes["ONE"] = 1] = "ONE";
        EscapeQuotes[EscapeQuotes["TWO"] = 2] = "TWO";
        EscapeQuotes[EscapeQuotes["THREE"] = 3] = "THREE";
    })(EscapeQuotes = SourceFilesModel.EscapeQuotes || (SourceFilesModel.EscapeQuotes = {}));
    let UpdateOption;
    (function (UpdateOption) {
        UpdateOption["CLEAR_TRANSLATIONS_AND_APPROVALS"] = "clear_translations_and_approvals";
        UpdateOption["KEEP_TRANSLATIONS"] = "keep_translations";
        UpdateOption["KEEP_TRANSLATIONS_AND_APPROVALS"] = "keep_translations_and_approvals";
    })(UpdateOption = SourceFilesModel.UpdateOption || (SourceFilesModel.UpdateOption = {}));
})(SourceFilesModel = exports.SourceFilesModel || (exports.SourceFilesModel = {}));


/***/ }),

/***/ 2948:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SourceStringsModel = exports.SourceStrings = void 0;
const core_1 = __nccwpck_require__(4735);
class SourceStrings extends core_1.CrowdinApi {
    listProjectStrings(projectId, fileIdOrRequest, limit, offset, filter, denormalizePlaceholders, labelIds, scope, croql) {
        let url = `${this.url}/projects/${projectId}/strings`;
        let request;
        if (fileIdOrRequest && typeof fileIdOrRequest === 'object') {
            request = fileIdOrRequest;
        }
        else {
            request = {
                fileId: fileIdOrRequest,
                limit,
                offset,
                filter,
                denormalizePlaceholders,
                labelIds,
                scope,
                croql,
            };
        }
        url = this.addQueryParam(url, 'fileId', request.fileId);
        url = this.addQueryParam(url, 'filter', request.filter);
        url = this.addQueryParam(url, 'denormalizePlaceholders', request.denormalizePlaceholders);
        url = this.addQueryParam(url, 'labelIds', request.labelIds);
        url = this.addQueryParam(url, 'scope', request.scope);
        url = this.addQueryParam(url, 'croql', request.croql);
        return this.getList(url, request.limit, request.offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    addString(projectId, request) {
        const url = `${this.url}/projects/${projectId}/strings`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param stringId string identifier
     */
    getString(projectId, stringId) {
        const url = `${this.url}/projects/${projectId}/strings/${stringId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param stringId string identifier
     */
    deleteString(projectId, stringId) {
        const url = `${this.url}/projects/${projectId}/strings/${stringId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param stringId string identifier
     * @param request request body
     */
    editString(projectId, stringId, request) {
        const url = `${this.url}/projects/${projectId}/strings/${stringId}`;
        return this.patch(url, request, this.defaultConfig());
    }
}
exports.SourceStrings = SourceStrings;
var SourceStringsModel;
(function (SourceStringsModel) {
    let Type;
    (function (Type) {
        Type[Type["TEXT"] = 0] = "TEXT";
        Type[Type["ASSET"] = 1] = "ASSET";
        Type[Type["ICU"] = 2] = "ICU";
    })(Type = SourceStringsModel.Type || (SourceStringsModel.Type = {}));
    let Scope;
    (function (Scope) {
        Scope["IDENTIFIER"] = "identifier";
        Scope["TEXT"] = "text";
        Scope["CONTEXT"] = "context";
    })(Scope = SourceStringsModel.Scope || (SourceStringsModel.Scope = {}));
})(SourceStringsModel = exports.SourceStringsModel || (exports.SourceStringsModel = {}));


/***/ }),

/***/ 2901:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringCommentsModel = exports.StringComments = void 0;
const core_1 = __nccwpck_require__(4735);
class StringComments extends core_1.CrowdinApi {
    listStringComments(projectId, stringIdOrRequest, type, targetLanguageId, issueType, issueStatus) {
        let url = `${this.url}/projects/${projectId}/comments`;
        let request;
        if (stringIdOrRequest && typeof stringIdOrRequest === 'object') {
            request = stringIdOrRequest;
        }
        else {
            request = { stringId: stringIdOrRequest, type, targetLanguageId, issueStatus, issueType };
        }
        url = this.addQueryParam(url, 'stringId', request.stringId);
        url = this.addQueryParam(url, 'type', request.type);
        url = this.addQueryParam(url, 'targetLanguageId', request.targetLanguageId);
        url = this.addQueryParam(url, 'issueType', request.issueType);
        url = this.addQueryParam(url, 'issueStatus', request.issueStatus);
        return this.getList(url, request.limit, request.offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    addStringComment(projectId, request) {
        const url = `${this.url}/projects/${projectId}/comments`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param stringCommentId string comment identifier
     */
    getStringComment(projectId, stringCommentId) {
        const url = `${this.url}/projects/${projectId}/comments/${stringCommentId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param stringCommentId string comment identifier
     */
    deleteStringComment(projectId, stringCommentId) {
        const url = `${this.url}/projects/${projectId}/comments/${stringCommentId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param stringCommentId string comment identifier
     * @param request request body
     */
    editStringComment(projectId, stringCommentId, request) {
        const url = `${this.url}/projects/${projectId}/comments/${stringCommentId}`;
        return this.patch(url, request, this.defaultConfig());
    }
}
exports.StringComments = StringComments;
var StringCommentsModel;
(function (StringCommentsModel) {
    let Type;
    (function (Type) {
        Type["COMMENT"] = "comment";
        Type["ISSUE"] = "issue";
    })(Type = StringCommentsModel.Type || (StringCommentsModel.Type = {}));
    let IssueType;
    (function (IssueType) {
        IssueType["GENERAL_QUESTION"] = "general_question";
        IssueType["TRANSLATION_MISTAKE"] = "translation_mistake";
        IssueType["CONTEXT_REQUEST"] = "context_request";
        IssueType["SOURCE_MISTAKE"] = "source_mistake";
    })(IssueType = StringCommentsModel.IssueType || (StringCommentsModel.IssueType = {}));
    let IssueStatus;
    (function (IssueStatus) {
        IssueStatus["UNRESOLVED"] = "unresolved";
        IssueStatus["RESOLVED"] = "resolved";
    })(IssueStatus = StringCommentsModel.IssueStatus || (StringCommentsModel.IssueStatus = {}));
})(StringCommentsModel = exports.StringCommentsModel || (exports.StringCommentsModel = {}));


/***/ }),

/***/ 4009:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringTranslationsModel = exports.StringTranslations = void 0;
const core_1 = __nccwpck_require__(4735);
class StringTranslations extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param stringId string identifier
     * @param languageId language identifier
     * @param translationId translation identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     * @param fileId file identifier
     */
    listTranslationApprovals(projectId, stringId, languageId, translationId, limit, offset, fileId) {
        let url = `${this.url}/projects/${projectId}/approvals`;
        url = this.addQueryParam(url, 'stringId', stringId);
        url = this.addQueryParam(url, 'languageId', languageId);
        url = this.addQueryParam(url, 'translationId', translationId);
        url = this.addQueryParam(url, 'fileId', fileId);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    addApproval(projectId, request) {
        const url = `${this.url}/projects/${projectId}/approvals`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param approvalId approval identifier
     */
    approvalInfo(projectId, approvalId) {
        const url = `${this.url}/projects/${projectId}/approvals/${approvalId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param approvalId approval identifier
     */
    removeApproval(projectId, approvalId) {
        const url = `${this.url}/projects/${projectId}/approvals/${approvalId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param languageId language identifier
     * @param stringIds filter translations by stringIds
     * @param fileId filter translations by fileId
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     * @param labelIds filter translations by fileId
     * @param denormalizePlaceholders enable denormalize placeholders
     * @param croql filter translations by CroQL (Can't be used with `stringIds`, `labelIds` or `fileId` in same request)
     */
    listLanguageTranslations(projectId, languageId, stringIds, fileId, limit, offset, labelIds, denormalizePlaceholders, croql) {
        let url = `${this.url}/projects/${projectId}/languages/${languageId}/translations`;
        url = this.addQueryParam(url, 'stringIds', stringIds);
        url = this.addQueryParam(url, 'fileId', fileId);
        url = this.addQueryParam(url, 'labelIds', labelIds);
        url = this.addQueryParam(url, 'denormalizePlaceholders', denormalizePlaceholders);
        url = this.addQueryParam(url, 'croql', croql);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param stringId string identifier
     * @param languageId language identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     * @param denormalizePlaceholders enable denormalize placeholders
     */
    listStringTranslations(projectId, stringId, languageId, limit, offset, denormalizePlaceholders) {
        let url = `${this.url}/projects/${projectId}/translations`;
        url = this.addQueryParam(url, 'stringId', stringId);
        url = this.addQueryParam(url, 'languageId', languageId);
        url = this.addQueryParam(url, 'denormalizePlaceholders', denormalizePlaceholders);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    addTranslation(projectId, request) {
        const url = `${this.url}/projects/${projectId}/translations`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param stringId string identifier
     * @param languageId language identifier
     */
    deleteAllTranslations(projectId, stringId, languageId) {
        let url = `${this.url}/projects/${projectId}/translations`;
        url = this.addQueryParam(url, 'stringId', stringId);
        url = this.addQueryParam(url, 'languageId', languageId);
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param translationId translation identifier
     */
    translationInfo(projectId, translationId) {
        const url = `${this.url}/projects/${projectId}/translations/${translationId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param translation translation identifier
     */
    deleteTranslation(projectId, translationId) {
        const url = `${this.url}/projects/${projectId}/translations/${translationId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param translation translation identifier
     */
    restoreTranslation(projectId, translationId) {
        const url = `${this.url}/projects/${projectId}/translations/${translationId}/restore`;
        return this.put(url, {}, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param stringId string identifier
     * @param languageId language identifier
     * @param translationId translation identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listTranslationVotes(projectId, stringId, languageId, translationId, limit, offset) {
        let url = `${this.url}/projects/${projectId}/votes`;
        url = this.addQueryParam(url, 'stringId', stringId);
        url = this.addQueryParam(url, 'languageId', languageId);
        url = this.addQueryParam(url, 'translationId', translationId);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    addVote(projectId, request) {
        const url = `${this.url}/projects/${projectId}/votes`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param voteId vote identifier
     */
    voteInfo(projectId, voteId) {
        const url = `${this.url}/projects/${projectId}/votes/${voteId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param voteId vote identifier
     */
    cancelVote(projectId, voteId) {
        const url = `${this.url}/projects/${projectId}/votes/${voteId}`;
        return this.delete(url, this.defaultConfig());
    }
}
exports.StringTranslations = StringTranslations;
var StringTranslationsModel;
(function (StringTranslationsModel) {
    let Mark;
    (function (Mark) {
        Mark["UP"] = "up";
        Mark["DOWN"] = "down";
    })(Mark = StringTranslationsModel.Mark || (StringTranslationsModel.Mark = {}));
})(StringTranslationsModel = exports.StringTranslationsModel || (exports.StringTranslationsModel = {}));


/***/ }),

/***/ 9273:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TasksModel = exports.Tasks = void 0;
const core_1 = __nccwpck_require__(4735);
class Tasks extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     * @param status list tasks with specified statuses. It can be one status or a list of comma-separated status values
     */
    listTasks(projectId, limit, offset, status) {
        let url = `${this.url}/projects/${projectId}/tasks`;
        url = this.addQueryParam(url, 'status', status);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    addTask(projectId, request) {
        const url = `${this.url}/projects/${projectId}/tasks`;
        return this.post(url, request, this.defaultConfig());
    }
    exportTaskStrings(projectId, taskId) {
        const url = `${this.url}/projects/${projectId}/tasks/${taskId}/exports`;
        return this.post(url, {}, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param taskId task identifier
     */
    getTask(projectId, taskId) {
        const url = `${this.url}/projects/${projectId}/tasks/${taskId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param taskId task identifier
     */
    deleteTask(projectId, taskId) {
        const url = `${this.url}/projects/${projectId}/tasks/${taskId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param taskId task identifier
     * @param request request body
     */
    editTask(projectId, taskId, request) {
        const url = `${this.url}/projects/${projectId}/tasks/${taskId}`;
        return this.patch(url, request, this.defaultConfig());
    }
    /**
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     * @param status list tasks with specified statuses. It can be one status or a list of comma-separated status values
     * @param isArchived list archived/not archived tasks for the authorized user. 1 - archived, 0 - not archived
     */
    listUserTasks(limit, offset, status, isArchived) {
        let url = `${this.url}/user/tasks`;
        url = this.addQueryParam(url, 'status', status);
        url = this.addQueryParam(url, 'isArchived', isArchived);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param taskId task identifier
     * @param request request body
     */
    editTaskArchivedStatus(projectId, taskId, request) {
        let url = `${this.url}/user/tasks/${taskId}`;
        url = this.addQueryParam(url, 'projectId', projectId);
        return this.patch(url, request, this.defaultConfig());
    }
}
exports.Tasks = Tasks;
var TasksModel;
(function (TasksModel) {
    let Status;
    (function (Status) {
        Status["TODO"] = "todo";
        Status["IN_PROGRESS"] = "in_progress";
        Status["DONE"] = "done";
        Status["CLOSED"] = "closed";
    })(Status = TasksModel.Status || (TasksModel.Status = {}));
    let Type;
    (function (Type) {
        Type[Type["TRANSLATE"] = 0] = "TRANSLATE";
        Type[Type["PROOFREAD"] = 1] = "PROOFREAD";
        Type[Type["TRANSLATE_BY_VENDOR"] = 2] = "TRANSLATE_BY_VENDOR";
    })(Type = TasksModel.Type || (TasksModel.Type = {}));
    let Expertise;
    (function (Expertise) {
        Expertise["STANDARD"] = "standard";
        Expertise["MOBILE_APPLICATIONS"] = "mobile-applications";
        Expertise["SOFTWARE_IT"] = "software-it";
        Expertise["GAMING_VIDEO_GAMES"] = "gaming-video-games";
        Expertise["TECHNICAL_ENGINEERING"] = "technical-engineering";
        Expertise["MARKETING_CONSUMER_MEDIA"] = "marketing-consumer-media";
        Expertise["BUSINESS_FINANCE"] = "business-finance";
        Expertise["LEGAL_CERTIFICATE"] = "legal-certificate";
        Expertise["CV"] = "cv";
        Expertise["MEDICAL"] = "medical";
        Expertise["PATENTS"] = "patents";
        Expertise["AD_WORDS_BANNERS"] = "ad-words-banners";
        Expertise["AUTOMOTIVE_AEROSPACE"] = "automotive-aerospace";
        Expertise["SCIENTIFIC"] = "scientific";
        Expertise["SCIENTIFIC_ACADEMIC"] = "scientific-academic";
        Expertise["TOURISM"] = "tourism";
        Expertise["CERTIFICATES_TRANSLATION"] = "certificates-translation";
        Expertise["TRAINING_EMPLOYEE_HANDBOOKS"] = "training-employee-handbooks";
        Expertise["FOREX_CRYPTO"] = "forex-crypto";
    })(Expertise = TasksModel.Expertise || (TasksModel.Expertise = {}));
    let Tone;
    (function (Tone) {
        Tone["EPTY"] = "";
        Tone["INFORMAL"] = "Informal";
        Tone["FRIENDLY"] = "Friendly";
        Tone["BUSINESS"] = "Business";
        Tone["FORMAL"] = "Formal";
        Tone["OTHER"] = "other";
    })(Tone = TasksModel.Tone || (TasksModel.Tone = {}));
    let Purpose;
    (function (Purpose) {
        Purpose["STANDARD"] = "standard";
        Purpose["PERSONAL_USE"] = "Personal use";
        Purpose["ONLINE_CONTENT"] = "Online content";
        Purpose["APP_WEB_LOCALIZATION"] = "App/Web localization";
        Purpose["MEDIA_CONTENT"] = "Media content";
        Purpose["SEMI_TECHNICAL"] = "Semi-technical";
        Purpose["OTHER"] = "other";
    })(Purpose = TasksModel.Purpose || (TasksModel.Purpose = {}));
    let Subject;
    (function (Subject) {
        Subject["GENERAL"] = "general";
        Subject["ACCOUNTING_FINANCE"] = "accounting_finance";
        Subject["AEROSPACE_DEFENCE"] = "aerospace_defence";
        Subject["ARCHITECTURE"] = "architecture";
        Subject["ART"] = "art";
        Subject["AUTOMOTIVE"] = "automotive";
        Subject["CERTIFICATES_DIPLOMAS_LICENCES_CV_ETC"] = "certificates_diplomas_licences_cv_etc";
        Subject["CHEMICAL"] = "chemical";
        Subject["CIVIL_ENGINEERING_CONSTRUCTION"] = "civil_engineering_construction";
        Subject["CORPORATE_SOCIAL_RESPONSIBILITY"] = "corporate_social_responsibility";
        Subject["COSMETICS"] = "cosmetics";
        Subject["CULINARY"] = "culinary";
        Subject["ELECTRONICS_ELECTRICAL_ENGINEERING"] = "electronics_electrical_engineering";
        Subject["ENERGY_POWER_GENERATION_OIL_GAS"] = "energy_power_generation_oil_gas";
        Subject["ENVIRONMENT"] = "environment";
        Subject["FASHION"] = "fashion";
        Subject["GAMES_VISEOGAMES_CASINO"] = "games_viseogames_casino";
        Subject["GENERAL_BUSINESS_COMMERCE"] = "general_business_commerce";
        Subject["HISTORY_ARCHAEOLOGY"] = "history_archaeology";
        Subject["INFORMATION_TECHNOLOGY"] = "information_technology";
        Subject["INSURANCE"] = "insurance";
        Subject["INTERNET_E_COMMERCE"] = "internet_e-commerce";
        Subject["LEGAL_DOCUMENTS_CONTRACTS"] = "legal_documents_contracts";
        Subject["LITERARY_TRANSLATIONS"] = "literary_translations";
        Subject["MARKETING_ADVERTISING_MATERIAL_PUBLIC_RELATIONS"] = "marketing_advertising_material_public_relations";
        Subject["MATEMATICS_AND_PHYSICS"] = "matematics_and_physics";
        Subject["MECHANICAL_MANUFACTURING"] = "mechanical_manufacturing";
        Subject["MEDIA_JOURNALISM_PUBLISHING"] = "media_journalism_publishing";
        Subject["MEDICAL_PHARMACEUTICAL"] = "medical_pharmaceutical";
        Subject["MUSIC"] = "music";
        Subject["PRIVATE_CORRESPONDENCE_LETTERS"] = "private_correspondence_letters";
        Subject["RELIGION"] = "religion";
        Subject["SCIENCE"] = "science";
        Subject["SHIPPING_SAILING_MARITIME"] = "shipping_sailing_maritime";
        Subject["SOCIAL_SCIENCE"] = "social_science";
        Subject["TELECOMMUNICATIONS"] = "telecommunications";
        Subject["TRAVEL_TOURISM"] = "travel_tourism";
    })(Subject = TasksModel.Subject || (TasksModel.Subject = {}));
})(TasksModel = exports.TasksModel || (exports.TasksModel = {}));


/***/ }),

/***/ 3436:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Teams = void 0;
const core_1 = __nccwpck_require__(4735);
class Teams extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param request request body
     */
    addTeamToProject(projectId, request) {
        const url = `${this.url}/projects/${projectId}/teams`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listTeams(limit, offset) {
        const url = `${this.url}/teams`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param request request body
     */
    addTeam(request) {
        const url = `${this.url}/teams`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param teamId team identifier
     */
    getTeam(teamId) {
        const url = `${this.url}/teams/${teamId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param teamId team identifier
     */
    deleteTeam(teamId) {
        const url = `${this.url}/teams/${teamId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param teamId team identifier
     * @param request request body
     */
    editTeam(teamId, request) {
        const url = `${this.url}/teams/${teamId}`;
        return this.patch(url, request, this.defaultConfig());
    }
    /**
     * @param teamId team identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    teamMembersList(teamId, limit, offset) {
        const url = `${this.url}/teams/${teamId}/members`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param teamId team identifier
     * @param request request body
     */
    addTeamMembers(teamId, request) {
        const url = `${this.url}/teams/${teamId}/members`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param teamId team identifier
     */
    deleteAllTeamMembers(teamId) {
        const url = `${this.url}/teams/${teamId}/members`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param teamId team identifier
     * @param memberId member identifier
     */
    deleteTeamMember(teamId, memberId) {
        const url = `${this.url}/teams/${teamId}/members/${memberId}`;
        return this.delete(url, this.defaultConfig());
    }
}
exports.Teams = Teams;


/***/ }),

/***/ 2757:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslationMemoryModel = exports.TranslationMemory = void 0;
const core_1 = __nccwpck_require__(4735);
class TranslationMemory extends core_1.CrowdinApi {
    /**
     * @param groupId group identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listTm(groupId, limit, offset) {
        let url = `${this.url}/tms`;
        url = this.addQueryParam(url, 'groupId', groupId);
        return this.getList(url, limit, offset);
    }
    /**
     * @param request request body
     */
    addTm(request) {
        const url = `${this.url}/tms`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param tmId tm identifier
     */
    getTm(tmId) {
        const url = `${this.url}/tms/${tmId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param tmId tm identifier
     */
    deleteTm(tmId) {
        const url = `${this.url}/tms/${tmId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param tmId tm identifier
     * @param request request body
     */
    editTm(tmId, request) {
        const url = `${this.url}/tms/${tmId}`;
        return this.patch(url, request, this.defaultConfig());
    }
    /**
     * @param tmId tm identifier
     */
    clearTm(tmId) {
        const url = `${this.url}/tms/${tmId}/segments`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param tmId tm identifier
     * @param exportId export identifier
     */
    downloadTm(tmId, exportId) {
        const url = `${this.url}/tms/${tmId}/exports/${exportId}/download`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param tmId tm identifier
     * @param request request body
     */
    exportTm(tmId, request) {
        const url = `${this.url}/tms/${tmId}/exports`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param tmId tm identifier
     * @param exportId export identifier
     */
    checkExportStatus(tmId, exportId) {
        const url = `${this.url}/tms/${tmId}/exports/${exportId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param tmId tm identifier
     * @param request request body
     */
    importTm(tmId, request) {
        const url = `${this.url}/tms/${tmId}/imports`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param tmId tm identifier
     * @param importId import identifier
     */
    checkImportStatus(tmId, importId) {
        const url = `${this.url}/tms/${tmId}/imports/${importId}`;
        return this.get(url, this.defaultConfig());
    }
}
exports.TranslationMemory = TranslationMemory;
var TranslationMemoryModel;
(function (TranslationMemoryModel) {
    let Format;
    (function (Format) {
        Format["TMX"] = "tmx";
        Format["CSV"] = "csv";
        Format["XLSX"] = "xlsx";
    })(Format = TranslationMemoryModel.Format || (TranslationMemoryModel.Format = {}));
})(TranslationMemoryModel = exports.TranslationMemoryModel || (exports.TranslationMemoryModel = {}));


/***/ }),

/***/ 7658:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslationStatusModel = exports.TranslationStatus = void 0;
const core_1 = __nccwpck_require__(4735);
class TranslationStatus extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param branchId branch identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    getBranchProgress(projectId, branchId, limit, offset) {
        const url = `${this.url}/projects/${projectId}/branches/${branchId}/languages/progress`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param directoryId directory identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    getDirectoryProgress(projectId, directoryId, limit, offset) {
        const url = `${this.url}/projects/${projectId}/directories/${directoryId}/languages/progress`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param languageId language identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    getLanguageProgress(projectId, languageId, limit, offset) {
        const url = `${this.url}/projects/${projectId}/languages/${languageId}/progress`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     * @param languageIds language identifier for filter
     */
    getProjectProgress(projectId, limit, offset, languageIds) {
        let url = `${this.url}/projects/${projectId}/languages/progress`;
        url = this.addQueryParam(url, 'languageIds', languageIds);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param fileId file identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    getFileProgress(projectId, fileId, limit, offset) {
        const url = `${this.url}/projects/${projectId}/files/${fileId}/languages/progress`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     * @param category defines the issue category
     * @param validation defines the QA check issue validation type
     * @param languageIds filter progress by languageId
     */
    listQaCheckIssues(projectId, limit, offset, category, validation, languageIds) {
        let url = `${this.url}/projects/${projectId}/qa-checks`;
        url = this.addQueryParam(url, 'category', category);
        url = this.addQueryParam(url, 'validation', validation);
        url = this.addQueryParam(url, 'languageIds', languageIds);
        return this.getList(url, limit, offset);
    }
}
exports.TranslationStatus = TranslationStatus;
var TranslationStatusModel;
(function (TranslationStatusModel) {
    let Category;
    (function (Category) {
        Category["EMPTY"] = "empty";
        Category["VARIABLES"] = "variables";
        Category["TAGS"] = "tags";
        Category["PUNCTUATION"] = "punctuation";
        Category["SYMBOL_REGISTER"] = "symbol_register";
        Category["SPACES"] = "spaces";
        Category["SIZE"] = "size";
        Category["SPECIAL_SYMBOLS"] = "special_symbols";
        Category["WRONG_TRANSLATION"] = "wrong_translation";
        Category["SPELLCHECK"] = "spellcheck";
        Category["ICU"] = "icu";
    })(Category = TranslationStatusModel.Category || (TranslationStatusModel.Category = {}));
    let Validation;
    (function (Validation) {
        Validation["EMPTY_STRING_CHECK"] = "empty_string_check";
        Validation["EMPTY_SUGGESTION_CHECK"] = "empty_suggestion_check";
        Validation["MAX_LENGTH_CHECK"] = "max_length_check";
        Validation["TAGS_CHECK"] = "tags_check";
        Validation["MISMATCH_IDS_CHECK"] = "mismatch_ids_check";
        Validation["CDATA_CHECK"] = "cdata_check";
        Validation["SPECIALS_SYMBOLS_CHECK"] = "specials_symbols_check";
        Validation["LEADING_NEWLINES_CHECK"] = "leading_newlines_check";
        Validation["TRAILING_NEWLINES_CHECK"] = "trailing_newlines_check";
        Validation["LEADING_SPACES_CHECK"] = "leading_spaces_check";
        Validation["TRAILING_SPACES_CHECK"] = "trailing_spaces_check";
        Validation["MULTIPLE_SPACES_CHECK"] = "multiple_spaces_check";
        Validation["CUSTOM_BLOCKED_VARIABLES_CHECK"] = "custom_blocked_variables_check";
        Validation["HIGHEST_PRIORITY_CUSTOM_VARIABLES_CHECK"] = "highest_priority_custom_variables_check";
        Validation["HIGHEST_PRIORITY_VARIABLES_CHECK"] = "highest_priority_variables_check";
        Validation["C_VARIABLES_CHECK"] = "c_variables_check";
        Validation["PYTHON_VARIABLES_CHECK"] = "python_variables_check";
        Validation["RAILS_VARIABLES_CHECK"] = "rails_variables_check";
        Validation["JAVA_VARIABLES_CHECK"] = "java_variables_check";
        Validation["DOT_NET_VARIABLES_CHECK"] = "dot_net_variables_check";
        Validation["TWIG_VARIABLES_CHECK"] = "twig_variables_check";
        Validation["PHP_VARIABLES_CHECK"] = "php_variables_check";
        Validation["FREEMARKER_VARIABLES_CHECK"] = "freemarker_variables_check";
        Validation["LOWEST_PRIORITY_VARIABLE_CHECK"] = "lowest_priority_variable_check";
        Validation["LOWEST_PRIORITY_CUSTOM_VARIABLES_CHECK"] = "lowest_priority_custom_variables_check";
        Validation["PUNCTUATION_CHECK"] = "punctuation_check";
        Validation["SPACES_BEFORE_PUNCTUATION_CHECK"] = "spaces_before_punctuation_check";
        Validation["SPACES_AFTER_PUNCTUATION_CHECK"] = "spaces_after_punctuation_check";
        Validation["NON_BREAKING_SPACES_CHECK"] = "non_breaking_spaces_check";
        Validation["CAPITALIZE_CHECK"] = "capitalize_check";
        Validation["MULTIPLE_UPPERCASE_CHECK"] = "multiple_uppercase_check";
        Validation["PARENTHESES_CHECK"] = "parentheses_check";
        Validation["ENTITIES_CHECK"] = "entities_check";
        Validation["ESCAPED_QUOTES_CHECK"] = "escaped_quotes_check";
        Validation["WRONG_TRANSLATION_ISSUE_CHECK"] = "wrong_translation_issue_check";
        Validation["SPELLCHECK"] = "spellcheck";
        Validation["ICU_CHECK"] = "icu_check";
    })(Validation = TranslationStatusModel.Validation || (TranslationStatusModel.Validation = {}));
})(TranslationStatusModel = exports.TranslationStatusModel || (exports.TranslationStatusModel = {}));


/***/ }),

/***/ 7637:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslationsModel = exports.Translations = void 0;
const core_1 = __nccwpck_require__(4735);
class Translations extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param request request body
     */
    applyPreTranslation(projectId, request) {
        const url = `${this.url}/projects/${projectId}/pre-translations`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param preTranslationId pre translation identifier
     */
    preTranslationStatus(projectId, preTranslationId) {
        const url = `${this.url}/projects/${projectId}/pre-translations/${preTranslationId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param fileId file identifier
     * @param request request body
     * @param eTag eTag 'If-None-Match' header
     */
    buildProjectFileTranslation(projectId, fileId, request, eTag) {
        const url = `${this.url}/projects/${projectId}/translations/builds/files/${fileId}`;
        const config = this.defaultConfig();
        if (!!eTag) {
            config.headers['If-None-Match'] = eTag;
        }
        return this.post(url, request, config);
    }
    /**
     * @param projectId project identifier
     * @param branchId branch identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listProjectBuilds(projectId, branchId, limit, offset) {
        let url = `${this.url}/projects/${projectId}/translations/builds`;
        url = this.addQueryParam(url, 'branchId', branchId);
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    buildProject(projectId, request = {}) {
        const url = `${this.url}/projects/${projectId}/translations/builds`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param buildId build identifier
     */
    downloadTranslations(projectId, buildId) {
        const url = `${this.url}/projects/${projectId}/translations/builds/${buildId}/download`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param buildId build identifier
     */
    checkBuildStatus(projectId, buildId) {
        const url = `${this.url}/projects/${projectId}/translations/builds/${buildId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param buildId build identifier
     */
    cancelBuild(projectId, buildId) {
        const url = `${this.url}/projects/${projectId}/translations/builds/${buildId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param languageId language identifier
     * @param request request body
     */
    uploadTranslation(projectId, languageId, request) {
        const url = `${this.url}/projects/${projectId}/translations/${languageId}`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    exportProjectTranslation(projectId, request) {
        const url = `${this.url}/projects/${projectId}/translations/exports`;
        return this.post(url, request, this.defaultConfig());
    }
}
exports.Translations = Translations;
var TranslationsModel;
(function (TranslationsModel) {
    let Method;
    (function (Method) {
        Method["TM"] = "tm";
        Method["MT"] = "mt";
    })(Method = TranslationsModel.Method || (TranslationsModel.Method = {}));
    let AutoApproveOption;
    (function (AutoApproveOption) {
        AutoApproveOption["ALL"] = "all";
        AutoApproveOption["EXCEPT_AUTO_SUBSTITUTED"] = "exceptAutoSubstituted";
        AutoApproveOption["PERFECT_MATCH_ONLY"] = "perfectMatchOnly";
        AutoApproveOption["NONE"] = "none";
    })(AutoApproveOption = TranslationsModel.AutoApproveOption || (TranslationsModel.AutoApproveOption = {}));
    let CharTransformation;
    (function (CharTransformation) {
        CharTransformation["ASIAN"] = "asian";
        CharTransformation["EUROPEAN"] = "european";
        CharTransformation["ARABIC"] = "arabic";
        CharTransformation["CYRILLIC"] = "cyrillic";
    })(CharTransformation = TranslationsModel.CharTransformation || (TranslationsModel.CharTransformation = {}));
})(TranslationsModel = exports.TranslationsModel || (exports.TranslationsModel = {}));


/***/ }),

/***/ 4976:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UploadStorage = void 0;
const core_1 = __nccwpck_require__(4735);
const mimetypes = {
    '3dml': 'text/vnd.in3d.3dml',
    '3g2': 'video/3gpp2',
    '3gp': 'video/3gpp',
    '7z': 'application/x-7z-compressed',
    aab: 'application/x-authorware-bin',
    aac: 'audio/x-aac',
    aam: 'application/x-authorware-map',
    aas: 'application/x-authorware-seg',
    abw: 'application/x-abiword',
    ac: 'application/pkix-attr-cert',
    acc: 'application/vnd.americandynamics.acc',
    ace: 'application/x-ace-compressed',
    acu: 'application/vnd.acucobol',
    acutc: 'application/vnd.acucorp',
    adp: 'audio/adpcm',
    aep: 'application/vnd.audiograph',
    afm: 'application/x-font-type1',
    afp: 'application/vnd.ibm.modcap',
    ahead: 'application/vnd.ahead.space',
    ai: 'application/postscript',
    aif: 'audio/x-aiff',
    aifc: 'audio/x-aiff',
    aiff: 'audio/x-aiff',
    air: 'application/vnd.adobe.air-application-installer-package+zip',
    ait: 'application/vnd.dvb.ait',
    ami: 'application/vnd.amiga.ami',
    apk: 'application/vnd.android.package-archive',
    application: 'application/x-ms-application',
    apr: 'application/vnd.lotus-approach',
    asa: 'text/plain',
    asax: 'application/octet-stream',
    asc: 'application/pgp-signature',
    ascx: 'text/plain',
    asf: 'video/x-ms-asf',
    ashx: 'text/plain',
    asm: 'text/x-asm',
    asmx: 'text/plain',
    aso: 'application/vnd.accpac.simply.aso',
    asp: 'text/plain',
    aspx: 'text/plain',
    asx: 'video/x-ms-asf',
    atc: 'application/vnd.acucorp',
    atom: 'application/atom+xml',
    atomcat: 'application/atomcat+xml',
    atomsvc: 'application/atomsvc+xml',
    atx: 'application/vnd.antix.game-component',
    au: 'audio/basic',
    avi: 'video/x-msvideo',
    aw: 'application/applixware',
    axd: 'text/plain',
    azf: 'application/vnd.airzip.filesecure.azf',
    azs: 'application/vnd.airzip.filesecure.azs',
    azw: 'application/vnd.amazon.ebook',
    bat: 'application/x-msdownload',
    bcpio: 'application/x-bcpio',
    bdf: 'application/x-font-bdf',
    bdm: 'application/vnd.syncml.dm+wbxml',
    bed: 'application/vnd.realvnc.bed',
    bh2: 'application/vnd.fujitsu.oasysprs',
    bin: 'application/octet-stream',
    bmi: 'application/vnd.bmi',
    bmp: 'image/bmp',
    book: 'application/vnd.framemaker',
    box: 'application/vnd.previewsystems.box',
    boz: 'application/x-bzip2',
    bpk: 'application/octet-stream',
    btif: 'image/prs.btif',
    bz: 'application/x-bzip',
    bz2: 'application/x-bzip2',
    c: 'text/x-c',
    c11amc: 'application/vnd.cluetrust.cartomobile-config',
    c11amz: 'application/vnd.cluetrust.cartomobile-config-pkg',
    c4d: 'application/vnd.clonk.c4group',
    c4f: 'application/vnd.clonk.c4group',
    c4g: 'application/vnd.clonk.c4group',
    c4p: 'application/vnd.clonk.c4group',
    c4u: 'application/vnd.clonk.c4group',
    cab: 'application/vnd.ms-cab-compressed',
    car: 'application/vnd.curl.car',
    cat: 'application/vnd.ms-pki.seccat',
    cc: 'text/x-c',
    cct: 'application/x-director',
    ccxml: 'application/ccxml+xml',
    cdbcmsg: 'application/vnd.contact.cmsg',
    cdf: 'application/x-netcdf',
    cdkey: 'application/vnd.mediastation.cdkey',
    cdmia: 'application/cdmi-capability',
    cdmic: 'application/cdmi-container',
    cdmid: 'application/cdmi-domain',
    cdmio: 'application/cdmi-object',
    cdmiq: 'application/cdmi-queue',
    cdx: 'chemical/x-cdx',
    cdxml: 'application/vnd.chemdraw+xml',
    cdy: 'application/vnd.cinderella',
    cer: 'application/pkix-cert',
    cfc: 'application/x-coldfusion',
    cfm: 'application/x-coldfusion',
    cgm: 'image/cgm',
    chat: 'application/x-chat',
    chm: 'application/vnd.ms-htmlhelp',
    chrt: 'application/vnd.kde.kchart',
    cif: 'chemical/x-cif',
    cii: 'application/vnd.anser-web-certificate-issue-initiation',
    cil: 'application/vnd.ms-artgalry',
    cla: 'application/vnd.claymore',
    class: 'application/java-vm',
    clkk: 'application/vnd.crick.clicker.keyboard',
    clkp: 'application/vnd.crick.clicker.palette',
    clkt: 'application/vnd.crick.clicker.template',
    clkw: 'application/vnd.crick.clicker.wordbank',
    clkx: 'application/vnd.crick.clicker',
    clp: 'application/x-msclip',
    cmc: 'application/vnd.cosmocaller',
    cmdf: 'chemical/x-cmdf',
    cml: 'chemical/x-cml',
    cmp: 'application/vnd.yellowriver-custom-menu',
    cmx: 'image/x-cmx',
    cod: 'application/vnd.rim.cod',
    com: 'application/x-msdownload',
    conf: 'text/plain',
    cpio: 'application/x-cpio',
    cpp: 'text/x-c',
    cpt: 'application/mac-compactpro',
    crd: 'application/x-mscardfile',
    crl: 'application/pkix-crl',
    crt: 'application/x-x509-ca-cert',
    cryptonote: 'application/vnd.rig.cryptonote',
    cs: 'text/plain',
    csh: 'application/x-csh',
    csml: 'chemical/x-csml',
    csp: 'application/vnd.commonspace',
    css: 'text/css',
    cst: 'application/x-director',
    csv: 'text/csv',
    cu: 'application/cu-seeme',
    curl: 'text/vnd.curl',
    cww: 'application/prs.cww',
    cxt: 'application/x-director',
    cxx: 'text/x-c',
    dae: 'model/vnd.collada+xml',
    daf: 'application/vnd.mobius.daf',
    dataless: 'application/vnd.fdsn.seed',
    davmount: 'application/davmount+xml',
    dcr: 'application/x-director',
    dcurl: 'text/vnd.curl.dcurl',
    dd2: 'application/vnd.oma.dd2+xml',
    ddd: 'application/vnd.fujixerox.ddd',
    deb: 'application/x-debian-package',
    def: 'text/plain',
    deploy: 'application/octet-stream',
    der: 'application/x-x509-ca-cert',
    dfac: 'application/vnd.dreamfactory',
    dic: 'text/x-c',
    dir: 'application/x-director',
    dis: 'application/vnd.mobius.dis',
    dist: 'application/octet-stream',
    distz: 'application/octet-stream',
    djv: 'image/vnd.djvu',
    djvu: 'image/vnd.djvu',
    dll: 'application/x-msdownload',
    dmg: 'application/octet-stream',
    dms: 'application/octet-stream',
    dna: 'application/vnd.dna',
    doc: 'application/msword',
    docm: 'application/vnd.ms-word.document.macroenabled.12',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    dot: 'application/msword',
    dotm: 'application/vnd.ms-word.template.macroenabled.12',
    dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
    dp: 'application/vnd.osgi.dp',
    dpg: 'application/vnd.dpgraph',
    dra: 'audio/vnd.dra',
    dsc: 'text/prs.lines.tag',
    dssc: 'application/dssc+der',
    dtb: 'application/x-dtbook+xml',
    dtd: 'application/xml-dtd',
    dts: 'audio/vnd.dts',
    dtshd: 'audio/vnd.dts.hd',
    dump: 'application/octet-stream',
    dvi: 'application/x-dvi',
    dwf: 'model/vnd.dwf',
    dwg: 'image/vnd.dwg',
    dxf: 'image/vnd.dxf',
    dxp: 'application/vnd.spotfire.dxp',
    dxr: 'application/x-director',
    ecelp4800: 'audio/vnd.nuera.ecelp4800',
    ecelp7470: 'audio/vnd.nuera.ecelp7470',
    ecelp9600: 'audio/vnd.nuera.ecelp9600',
    ecma: 'application/ecmascript',
    edm: 'application/vnd.novadigm.edm',
    edx: 'application/vnd.novadigm.edx',
    efif: 'application/vnd.picsel',
    ei6: 'application/vnd.pg.osasli',
    elc: 'application/octet-stream',
    eml: 'message/rfc822',
    emma: 'application/emma+xml',
    eol: 'audio/vnd.digital-winds',
    eot: 'application/vnd.ms-fontobject',
    eps: 'application/postscript',
    epub: 'application/epub+zip',
    es3: 'application/vnd.eszigno3+xml',
    esf: 'application/vnd.epson.esf',
    et3: 'application/vnd.eszigno3+xml',
    etx: 'text/x-setext',
    exe: 'application/x-msdownload',
    exi: 'application/exi',
    ext: 'application/vnd.novadigm.ext',
    ez: 'application/andrew-inset',
    ez2: 'application/vnd.ezpix-album',
    ez3: 'application/vnd.ezpix-package',
    f: 'text/x-fortran',
    f4v: 'video/x-f4v',
    f77: 'text/x-fortran',
    f90: 'text/x-fortran',
    fbs: 'image/vnd.fastbidsheet',
    fcs: 'application/vnd.isac.fcs',
    fdf: 'application/vnd.fdf',
    /*eslint-disable-next-line @typescript-eslint/camelcase*/
    fe_launch: 'application/vnd.denovo.fcselayout-link',
    fg5: 'application/vnd.fujitsu.oasysgp',
    fgd: 'application/x-director',
    fh: 'image/x-freehand',
    fh4: 'image/x-freehand',
    fh5: 'image/x-freehand',
    fh7: 'image/x-freehand',
    fhc: 'image/x-freehand',
    fig: 'application/x-xfig',
    fli: 'video/x-fli',
    flo: 'application/vnd.micrografx.flo',
    flv: 'video/x-flv',
    flw: 'application/vnd.kde.kivio',
    flx: 'text/vnd.fmi.flexstor',
    fly: 'text/vnd.fly',
    fm: 'application/vnd.framemaker',
    fnc: 'application/vnd.frogans.fnc',
    for: 'text/x-fortran',
    fpx: 'image/vnd.fpx',
    frame: 'application/vnd.framemaker',
    fsc: 'application/vnd.fsc.weblaunch',
    fst: 'image/vnd.fst',
    ftc: 'application/vnd.fluxtime.clip',
    fti: 'application/vnd.anser-web-funds-transfer-initiation',
    fvt: 'video/vnd.fvt',
    fxp: 'application/vnd.adobe.fxp',
    fxpl: 'application/vnd.adobe.fxp',
    fzs: 'application/vnd.fuzzysheet',
    g2w: 'application/vnd.geoplan',
    g3: 'image/g3fax',
    g3w: 'application/vnd.geospace',
    gac: 'application/vnd.groove-account',
    gdl: 'model/vnd.gdl',
    geo: 'application/vnd.dynageo',
    gex: 'application/vnd.geometry-explorer',
    ggb: 'application/vnd.geogebra.file',
    ggt: 'application/vnd.geogebra.tool',
    ghf: 'application/vnd.groove-help',
    gif: 'image/gif',
    gim: 'application/vnd.groove-identity-message',
    gmx: 'application/vnd.gmx',
    gnumeric: 'application/x-gnumeric',
    gph: 'application/vnd.flographit',
    gqf: 'application/vnd.grafeq',
    gqs: 'application/vnd.grafeq',
    gram: 'application/srgs',
    gre: 'application/vnd.geometry-explorer',
    grv: 'application/vnd.groove-injector',
    grxml: 'application/srgs+xml',
    gsf: 'application/x-font-ghostscript',
    gtar: 'application/x-gtar',
    gtm: 'application/vnd.groove-tool-message',
    gtw: 'model/vnd.gtw',
    gv: 'text/vnd.graphviz',
    gxt: 'application/vnd.geonext',
    h: 'text/x-c',
    h261: 'video/h261',
    h263: 'video/h263',
    h264: 'video/h264',
    hal: 'application/vnd.hal+xml',
    hbci: 'application/vnd.hbci',
    hdf: 'application/x-hdf',
    hh: 'text/x-c',
    hlp: 'application/winhlp',
    hpgl: 'application/vnd.hp-hpgl',
    hpid: 'application/vnd.hp-hpid',
    hps: 'application/vnd.hp-hps',
    hqx: 'application/mac-binhex40',
    hta: 'application/octet-stream',
    htc: 'text/html',
    htke: 'application/vnd.kenameaapp',
    htm: 'text/html',
    html: 'text/html',
    hvd: 'application/vnd.yamaha.hv-dic',
    hvp: 'application/vnd.yamaha.hv-voice',
    hvs: 'application/vnd.yamaha.hv-script',
    i2g: 'application/vnd.intergeo',
    icc: 'application/vnd.iccprofile',
    ice: 'x-conference/x-cooltalk',
    icm: 'application/vnd.iccprofile',
    ico: 'image/x-icon',
    ics: 'text/calendar',
    ief: 'image/ief',
    ifb: 'text/calendar',
    ifm: 'application/vnd.shana.informed.formdata',
    iges: 'model/iges',
    igl: 'application/vnd.igloader',
    igm: 'application/vnd.insors.igm',
    igs: 'model/iges',
    igx: 'application/vnd.micrografx.igx',
    iif: 'application/vnd.shana.informed.interchange',
    imp: 'application/vnd.accpac.simply.imp',
    ims: 'application/vnd.ms-ims',
    in: 'text/plain',
    ini: 'text/plain',
    ipfix: 'application/ipfix',
    ipk: 'application/vnd.shana.informed.package',
    irm: 'application/vnd.ibm.rights-management',
    irp: 'application/vnd.irepository.package+xml',
    iso: 'application/octet-stream',
    itp: 'application/vnd.shana.informed.formtemplate',
    ivp: 'application/vnd.immervision-ivp',
    ivu: 'application/vnd.immervision-ivu',
    jad: 'text/vnd.sun.j2me.app-descriptor',
    jam: 'application/vnd.jam',
    jar: 'application/java-archive',
    java: 'text/x-java-source',
    jisp: 'application/vnd.jisp',
    jlt: 'application/vnd.hp-jlyt',
    jnlp: 'application/x-java-jnlp-file',
    joda: 'application/vnd.joost.joda-archive',
    jpe: 'image/jpeg',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    jpgm: 'video/jpm',
    jpgv: 'video/jpeg',
    jpm: 'video/jpm',
    js: 'text/javascript',
    json: 'application/json',
    kar: 'audio/midi',
    karbon: 'application/vnd.kde.karbon',
    kfo: 'application/vnd.kde.kformula',
    kia: 'application/vnd.kidspiration',
    kml: 'application/vnd.google-earth.kml+xml',
    kmz: 'application/vnd.google-earth.kmz',
    kne: 'application/vnd.kinar',
    knp: 'application/vnd.kinar',
    kon: 'application/vnd.kde.kontour',
    kpr: 'application/vnd.kde.kpresenter',
    kpt: 'application/vnd.kde.kpresenter',
    ksp: 'application/vnd.kde.kspread',
    ktr: 'application/vnd.kahootz',
    ktx: 'image/ktx',
    ktz: 'application/vnd.kahootz',
    kwd: 'application/vnd.kde.kword',
    kwt: 'application/vnd.kde.kword',
    lasxml: 'application/vnd.las.las+xml',
    latex: 'application/x-latex',
    lbd: 'application/vnd.llamagraphics.life-balance.desktop',
    lbe: 'application/vnd.llamagraphics.life-balance.exchange+xml',
    les: 'application/vnd.hhe.lesson-player',
    lha: 'application/octet-stream',
    link66: 'application/vnd.route66.link66+xml',
    list: 'text/plain',
    list3820: 'application/vnd.ibm.modcap',
    listafp: 'application/vnd.ibm.modcap',
    log: 'text/plain',
    lostxml: 'application/lost+xml',
    lrf: 'application/octet-stream',
    lrm: 'application/vnd.ms-lrm',
    ltf: 'application/vnd.frogans.ltf',
    lvp: 'audio/vnd.lucent.voice',
    lwp: 'application/vnd.lotus-wordpro',
    lzh: 'application/octet-stream',
    m13: 'application/x-msmediaview',
    m14: 'application/x-msmediaview',
    m1v: 'video/mpeg',
    m21: 'application/mp21',
    m2a: 'audio/mpeg',
    m2v: 'video/mpeg',
    m3a: 'audio/mpeg',
    m3u: 'audio/x-mpegurl',
    m3u8: 'application/vnd.apple.mpegurl',
    m4a: 'audio/mp4',
    m4u: 'video/vnd.mpegurl',
    m4v: 'video/mp4',
    ma: 'application/mathematica',
    mads: 'application/mads+xml',
    mag: 'application/vnd.ecowin.chart',
    maker: 'application/vnd.framemaker',
    man: 'text/troff',
    mathml: 'application/mathml+xml',
    mb: 'application/mathematica',
    mbk: 'application/vnd.mobius.mbk',
    mbox: 'application/mbox',
    mc1: 'application/vnd.medcalcdata',
    mcd: 'application/vnd.mcd',
    mcurl: 'text/vnd.curl.mcurl',
    mdb: 'application/x-msaccess',
    mdi: 'image/vnd.ms-modi',
    me: 'text/troff',
    mesh: 'model/mesh',
    meta4: 'application/metalink4+xml',
    mets: 'application/mets+xml',
    mfm: 'application/vnd.mfmp',
    mgp: 'application/vnd.osgeo.mapguide.package',
    mgz: 'application/vnd.proteus.magazine',
    mid: 'audio/midi',
    midi: 'audio/midi',
    mif: 'application/vnd.mif',
    mime: 'message/rfc822',
    mj2: 'video/mj2',
    mjp2: 'video/mj2',
    mlp: 'application/vnd.dolby.mlp',
    mmd: 'application/vnd.chipnuts.karaoke-mmd',
    mmf: 'application/vnd.smaf',
    mmr: 'image/vnd.fujixerox.edmics-mmr',
    mny: 'application/x-msmoney',
    mobi: 'application/x-mobipocket-ebook',
    mods: 'application/mods+xml',
    mov: 'video/quicktime',
    movie: 'video/x-sgi-movie',
    mp2: 'audio/mpeg',
    mp21: 'application/mp21',
    mp2a: 'audio/mpeg',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    mp4a: 'audio/mp4',
    mp4s: 'application/mp4',
    mp4v: 'video/mp4',
    mpc: 'application/vnd.mophun.certificate',
    mpe: 'video/mpeg',
    mpeg: 'video/mpeg',
    mpg: 'video/mpeg',
    mpg4: 'video/mp4',
    mpga: 'audio/mpeg',
    mpkg: 'application/vnd.apple.installer+xml',
    mpm: 'application/vnd.blueice.multipass',
    mpn: 'application/vnd.mophun.application',
    mpp: 'application/vnd.ms-project',
    mpt: 'application/vnd.ms-project',
    mpy: 'application/vnd.ibm.minipay',
    mqy: 'application/vnd.mobius.mqy',
    mrc: 'application/marc',
    mrcx: 'application/marcxml+xml',
    ms: 'text/troff',
    mscml: 'application/mediaservercontrol+xml',
    mseed: 'application/vnd.fdsn.mseed',
    mseq: 'application/vnd.mseq',
    msf: 'application/vnd.epson.msf',
    msh: 'model/mesh',
    msi: 'application/x-msdownload',
    msl: 'application/vnd.mobius.msl',
    msty: 'application/vnd.muvee.style',
    mts: 'model/vnd.mts',
    mus: 'application/vnd.musician',
    musicxml: 'application/vnd.recordare.musicxml+xml',
    mvb: 'application/x-msmediaview',
    mwf: 'application/vnd.mfer',
    mxf: 'application/mxf',
    mxl: 'application/vnd.recordare.musicxml',
    mxml: 'application/xv+xml',
    mxs: 'application/vnd.triscape.mxs',
    mxu: 'video/vnd.mpegurl',
    'n-gage': 'application/vnd.nokia.n-gage.symbian.install',
    n3: 'text/n3',
    nb: 'application/mathematica',
    nbp: 'application/vnd.wolfram.player',
    nc: 'application/x-netcdf',
    ncx: 'application/x-dtbncx+xml',
    ngdat: 'application/vnd.nokia.n-gage.data',
    nlu: 'application/vnd.neurolanguage.nlu',
    nml: 'application/vnd.enliven',
    nnd: 'application/vnd.noblenet-directory',
    nns: 'application/vnd.noblenet-sealer',
    nnw: 'application/vnd.noblenet-web',
    npx: 'image/vnd.net-fpx',
    nsf: 'application/vnd.lotus-notes',
    oa2: 'application/vnd.fujitsu.oasys2',
    oa3: 'application/vnd.fujitsu.oasys3',
    oas: 'application/vnd.fujitsu.oasys',
    obd: 'application/x-msbinder',
    oda: 'application/oda',
    odb: 'application/vnd.oasis.opendocument.database',
    odc: 'application/vnd.oasis.opendocument.chart',
    odf: 'application/vnd.oasis.opendocument.formula',
    odft: 'application/vnd.oasis.opendocument.formula-template',
    odg: 'application/vnd.oasis.opendocument.graphics',
    odi: 'application/vnd.oasis.opendocument.image',
    odm: 'application/vnd.oasis.opendocument.text-master',
    odp: 'application/vnd.oasis.opendocument.presentation',
    ods: 'application/vnd.oasis.opendocument.spreadsheet',
    odt: 'application/vnd.oasis.opendocument.text',
    oga: 'audio/ogg',
    ogg: 'audio/ogg',
    ogv: 'video/ogg',
    ogx: 'application/ogg',
    onepkg: 'application/onenote',
    onetmp: 'application/onenote',
    onetoc: 'application/onenote',
    onetoc2: 'application/onenote',
    opf: 'application/oebps-package+xml',
    oprc: 'application/vnd.palm',
    org: 'application/vnd.lotus-organizer',
    osf: 'application/vnd.yamaha.openscoreformat',
    osfpvg: 'application/vnd.yamaha.openscoreformat.osfpvg+xml',
    otc: 'application/vnd.oasis.opendocument.chart-template',
    otf: 'application/x-font-otf',
    otg: 'application/vnd.oasis.opendocument.graphics-template',
    oth: 'application/vnd.oasis.opendocument.text-web',
    oti: 'application/vnd.oasis.opendocument.image-template',
    otp: 'application/vnd.oasis.opendocument.presentation-template',
    ots: 'application/vnd.oasis.opendocument.spreadsheet-template',
    ott: 'application/vnd.oasis.opendocument.text-template',
    oxt: 'application/vnd.openofficeorg.extension',
    p: 'text/x-pascal',
    p10: 'application/pkcs10',
    p12: 'application/x-pkcs12',
    p7b: 'application/x-pkcs7-certificates',
    p7c: 'application/pkcs7-mime',
    p7m: 'application/pkcs7-mime',
    p7r: 'application/x-pkcs7-certreqresp',
    p7s: 'application/pkcs7-signature',
    p8: 'application/pkcs8',
    pas: 'text/x-pascal',
    paw: 'application/vnd.pawaafile',
    pbd: 'application/vnd.powerbuilder6',
    pbm: 'image/x-portable-bitmap',
    pcf: 'application/x-font-pcf',
    pcl: 'application/vnd.hp-pcl',
    pclxl: 'application/vnd.hp-pclxl',
    pct: 'image/x-pict',
    pcurl: 'application/vnd.curl.pcurl',
    pcx: 'image/x-pcx',
    pdb: 'application/vnd.palm',
    pdf: 'application/pdf',
    pfa: 'application/x-font-type1',
    pfb: 'application/x-font-type1',
    pfm: 'application/x-font-type1',
    pfr: 'application/font-tdpfr',
    pfx: 'application/x-pkcs12',
    pgm: 'image/x-portable-graymap',
    pgn: 'application/x-chess-pgn',
    pgp: 'application/pgp-encrypted',
    php: 'text/x-php',
    phps: 'application/x-httpd-phps',
    pic: 'image/x-pict',
    pkg: 'application/octet-stream',
    pki: 'application/pkixcmp',
    pkipath: 'application/pkix-pkipath',
    plb: 'application/vnd.3gpp.pic-bw-large',
    plc: 'application/vnd.mobius.plc',
    plf: 'application/vnd.pocketlearn',
    pls: 'application/pls+xml',
    pml: 'application/vnd.ctc-posml',
    png: 'image/png',
    pnm: 'image/x-portable-anymap',
    portpkg: 'application/vnd.macports.portpkg',
    pot: 'application/vnd.ms-powerpoint',
    potm: 'application/vnd.ms-powerpoint.template.macroenabled.12',
    potx: 'application/vnd.openxmlformats-officedocument.presentationml.template',
    ppam: 'application/vnd.ms-powerpoint.addin.macroenabled.12',
    ppd: 'application/vnd.cups-ppd',
    ppm: 'image/x-portable-pixmap',
    pps: 'application/vnd.ms-powerpoint',
    ppsm: 'application/vnd.ms-powerpoint.slideshow.macroenabled.12',
    ppsx: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
    ppt: 'application/vnd.ms-powerpoint',
    pptm: 'application/vnd.ms-powerpoint.presentation.macroenabled.12',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    pqa: 'application/vnd.palm',
    prc: 'application/x-mobipocket-ebook',
    pre: 'application/vnd.lotus-freelance',
    prf: 'application/pics-rules',
    ps: 'application/postscript',
    psb: 'application/vnd.3gpp.pic-bw-small',
    psd: 'image/vnd.adobe.photoshop',
    psf: 'application/x-font-linux-psf',
    pskcxml: 'application/pskc+xml',
    ptid: 'application/vnd.pvi.ptid1',
    pub: 'application/x-mspublisher',
    pvb: 'application/vnd.3gpp.pic-bw-var',
    pwn: 'application/vnd.3m.post-it-notes',
    pya: 'audio/vnd.ms-playready.media.pya',
    pyv: 'video/vnd.ms-playready.media.pyv',
    qam: 'application/vnd.epson.quickanime',
    qbo: 'application/vnd.intu.qbo',
    qfx: 'application/vnd.intu.qfx',
    qps: 'application/vnd.publishare-delta-tree',
    qt: 'video/quicktime',
    qwd: 'application/vnd.quark.quarkxpress',
    qwt: 'application/vnd.quark.quarkxpress',
    qxb: 'application/vnd.quark.quarkxpress',
    qxd: 'application/vnd.quark.quarkxpress',
    qxl: 'application/vnd.quark.quarkxpress',
    qxt: 'application/vnd.quark.quarkxpress',
    ra: 'audio/x-pn-realaudio',
    ram: 'audio/x-pn-realaudio',
    rar: 'application/x-rar-compressed',
    ras: 'image/x-cmu-raster',
    rb: 'text/plain',
    rcprofile: 'application/vnd.ipunplugged.rcprofile',
    rdf: 'application/rdf+xml',
    rdz: 'application/vnd.data-vision.rdz',
    rep: 'application/vnd.businessobjects',
    res: 'application/x-dtbresource+xml',
    resx: 'text/xml',
    rgb: 'image/x-rgb',
    rif: 'application/reginfo+xml',
    rip: 'audio/vnd.rip',
    rl: 'application/resource-lists+xml',
    rlc: 'image/vnd.fujixerox.edmics-rlc',
    rld: 'application/resource-lists-diff+xml',
    rm: 'application/vnd.rn-realmedia',
    rmi: 'audio/midi',
    rmp: 'audio/x-pn-realaudio-plugin',
    rms: 'application/vnd.jcp.javame.midlet-rms',
    rnc: 'application/relax-ng-compact-syntax',
    roff: 'text/troff',
    rp9: 'application/vnd.cloanto.rp9',
    rpss: 'application/vnd.nokia.radio-presets',
    rpst: 'application/vnd.nokia.radio-preset',
    rq: 'application/sparql-query',
    rs: 'application/rls-services+xml',
    rsd: 'application/rsd+xml',
    rss: 'application/rss+xml',
    rtf: 'application/rtf',
    rtx: 'text/richtext',
    s: 'text/x-asm',
    saf: 'application/vnd.yamaha.smaf-audio',
    sbml: 'application/sbml+xml',
    sc: 'application/vnd.ibm.secure-container',
    scd: 'application/x-msschedule',
    scm: 'application/vnd.lotus-screencam',
    scq: 'application/scvp-cv-request',
    scs: 'application/scvp-cv-response',
    scurl: 'text/vnd.curl.scurl',
    sda: 'application/vnd.stardivision.draw',
    sdc: 'application/vnd.stardivision.calc',
    sdd: 'application/vnd.stardivision.impress',
    sdkd: 'application/vnd.solent.sdkm+xml',
    sdkm: 'application/vnd.solent.sdkm+xml',
    sdp: 'application/sdp',
    sdw: 'application/vnd.stardivision.writer',
    see: 'application/vnd.seemail',
    seed: 'application/vnd.fdsn.seed',
    sema: 'application/vnd.sema',
    semd: 'application/vnd.semd',
    semf: 'application/vnd.semf',
    ser: 'application/java-serialized-object',
    setpay: 'application/set-payment-initiation',
    setreg: 'application/set-registration-initiation',
    'sfd-hdstx': 'application/vnd.hydrostatix.sof-data',
    sfs: 'application/vnd.spotfire.sfs',
    sgl: 'application/vnd.stardivision.writer-global',
    sgm: 'text/sgml',
    sgml: 'text/sgml',
    sh: 'application/x-sh',
    shar: 'application/x-shar',
    shf: 'application/shf+xml',
    sig: 'application/pgp-signature',
    silo: 'model/mesh',
    sis: 'application/vnd.symbian.install',
    sisx: 'application/vnd.symbian.install',
    sit: 'application/x-stuffit',
    sitx: 'application/x-stuffitx',
    skd: 'application/vnd.koan',
    skm: 'application/vnd.koan',
    skp: 'application/vnd.koan',
    skt: 'application/vnd.koan',
    sldm: 'application/vnd.ms-powerpoint.slide.macroenabled.12',
    sldx: 'application/vnd.openxmlformats-officedocument.presentationml.slide',
    slt: 'application/vnd.epson.salt',
    sm: 'application/vnd.stepmania.stepchart',
    smf: 'application/vnd.stardivision.math',
    smi: 'application/smil+xml',
    smil: 'application/smil+xml',
    snd: 'audio/basic',
    snf: 'application/x-font-snf',
    so: 'application/octet-stream',
    spc: 'application/x-pkcs7-certificates',
    spf: 'application/vnd.yamaha.smaf-phrase',
    spl: 'application/x-futuresplash',
    spot: 'text/vnd.in3d.spot',
    spp: 'application/scvp-vp-response',
    spq: 'application/scvp-vp-request',
    spx: 'audio/ogg',
    src: 'application/x-wais-source',
    srt: 'application/octet-stream',
    sru: 'application/sru+xml',
    srx: 'application/sparql-results+xml',
    sse: 'application/vnd.kodak-descriptor',
    ssf: 'application/vnd.epson.ssf',
    ssml: 'application/ssml+xml',
    st: 'application/vnd.sailingtracker.track',
    stc: 'application/vnd.sun.xml.calc.template',
    std: 'application/vnd.sun.xml.draw.template',
    stf: 'application/vnd.wt.stf',
    sti: 'application/vnd.sun.xml.impress.template',
    stk: 'application/hyperstudio',
    stl: 'application/vnd.ms-pki.stl',
    str: 'application/vnd.pg.format',
    stw: 'application/vnd.sun.xml.writer.template',
    sub: 'image/vnd.dvb.subtitle',
    sus: 'application/vnd.sus-calendar',
    susp: 'application/vnd.sus-calendar',
    sv4cpio: 'application/x-sv4cpio',
    sv4crc: 'application/x-sv4crc',
    svc: 'application/vnd.dvb.service',
    svd: 'application/vnd.svd',
    svg: 'image/svg+xml',
    svgz: 'image/svg+xml',
    swa: 'application/x-director',
    swf: 'application/x-shockwave-flash',
    swi: 'application/vnd.aristanetworks.swi',
    sxc: 'application/vnd.sun.xml.calc',
    sxd: 'application/vnd.sun.xml.draw',
    sxg: 'application/vnd.sun.xml.writer.global',
    sxi: 'application/vnd.sun.xml.impress',
    sxm: 'application/vnd.sun.xml.math',
    sxw: 'application/vnd.sun.xml.writer',
    t: 'text/troff',
    tao: 'application/vnd.tao.intent-module-archive',
    tar: 'application/x-tar',
    tcap: 'application/vnd.3gpp2.tcap',
    tcl: 'application/x-tcl',
    teacher: 'application/vnd.smart.teacher',
    tei: 'application/tei+xml',
    teicorpus: 'application/tei+xml',
    tex: 'application/x-tex',
    texi: 'application/x-texinfo',
    texinfo: 'application/x-texinfo',
    text: 'text/plain',
    tfi: 'application/thraud+xml',
    tfm: 'application/x-tex-tfm',
    thmx: 'application/vnd.ms-officetheme',
    tif: 'image/tiff',
    tiff: 'image/tiff',
    tmo: 'application/vnd.tmobile-livetv',
    torrent: 'application/x-bittorrent',
    tpl: 'application/vnd.groove-tool-template',
    tpt: 'application/vnd.trid.tpt',
    tr: 'text/troff',
    tra: 'application/vnd.trueapp',
    trm: 'application/x-msterminal',
    tsd: 'application/timestamped-data',
    tsv: 'text/tab-separated-values',
    ttc: 'application/x-font-ttf',
    ttf: 'application/x-font-ttf',
    ttl: 'text/turtle',
    twd: 'application/vnd.simtech-mindmapper',
    twds: 'application/vnd.simtech-mindmapper',
    txd: 'application/vnd.genomatix.tuxedo',
    txf: 'application/vnd.mobius.txf',
    txt: 'text/plain',
    u32: 'application/x-authorware-bin',
    udeb: 'application/x-debian-package',
    ufd: 'application/vnd.ufdl',
    ufdl: 'application/vnd.ufdl',
    umj: 'application/vnd.umajin',
    unityweb: 'application/vnd.unity',
    uoml: 'application/vnd.uoml+xml',
    uri: 'text/uri-list',
    uris: 'text/uri-list',
    urls: 'text/uri-list',
    ustar: 'application/x-ustar',
    utz: 'application/vnd.uiq.theme',
    uu: 'text/x-uuencode',
    uva: 'audio/vnd.dece.audio',
    uvd: 'application/vnd.dece.data',
    uvf: 'application/vnd.dece.data',
    uvg: 'image/vnd.dece.graphic',
    uvh: 'video/vnd.dece.hd',
    uvi: 'image/vnd.dece.graphic',
    uvm: 'video/vnd.dece.mobile',
    uvp: 'video/vnd.dece.pd',
    uvs: 'video/vnd.dece.sd',
    uvt: 'application/vnd.dece.ttml+xml',
    uvu: 'video/vnd.uvvu.mp4',
    uvv: 'video/vnd.dece.video',
    uvva: 'audio/vnd.dece.audio',
    uvvd: 'application/vnd.dece.data',
    uvvf: 'application/vnd.dece.data',
    uvvg: 'image/vnd.dece.graphic',
    uvvh: 'video/vnd.dece.hd',
    uvvi: 'image/vnd.dece.graphic',
    uvvm: 'video/vnd.dece.mobile',
    uvvp: 'video/vnd.dece.pd',
    uvvs: 'video/vnd.dece.sd',
    uvvt: 'application/vnd.dece.ttml+xml',
    uvvu: 'video/vnd.uvvu.mp4',
    uvvv: 'video/vnd.dece.video',
    uvvx: 'application/vnd.dece.unspecified',
    uvx: 'application/vnd.dece.unspecified',
    vcd: 'application/x-cdlink',
    vcf: 'text/x-vcard',
    vcg: 'application/vnd.groove-vcard',
    vcs: 'text/x-vcalendar',
    vcx: 'application/vnd.vcx',
    vis: 'application/vnd.visionary',
    viv: 'video/vnd.vivo',
    vor: 'application/vnd.stardivision.writer',
    vox: 'application/x-authorware-bin',
    vrml: 'model/vrml',
    vsd: 'application/vnd.visio',
    vsf: 'application/vnd.vsf',
    vss: 'application/vnd.visio',
    vst: 'application/vnd.visio',
    vsw: 'application/vnd.visio',
    vtu: 'model/vnd.vtu',
    vxml: 'application/voicexml+xml',
    w3d: 'application/x-director',
    wad: 'application/x-doom',
    wav: 'audio/x-wav',
    wax: 'audio/x-ms-wax',
    wbmp: 'image/vnd.wap.wbmp',
    wbs: 'application/vnd.criticaltools.wbs+xml',
    wbxml: 'application/vnd.wap.wbxml',
    wcm: 'application/vnd.ms-works',
    wdb: 'application/vnd.ms-works',
    weba: 'audio/webm',
    webm: 'video/webm',
    webp: 'image/webp',
    wg: 'application/vnd.pmi.widget',
    wgt: 'application/widget',
    wks: 'application/vnd.ms-works',
    wm: 'video/x-ms-wm',
    wma: 'audio/x-ms-wma',
    wmd: 'application/x-ms-wmd',
    wmf: 'application/x-msmetafile',
    wml: 'text/vnd.wap.wml',
    wmlc: 'application/vnd.wap.wmlc',
    wmls: 'text/vnd.wap.wmlscript',
    wmlsc: 'application/vnd.wap.wmlscriptc',
    wmv: 'video/x-ms-wmv',
    wmx: 'video/x-ms-wmx',
    wmz: 'application/x-ms-wmz',
    woff: 'application/x-font-woff',
    wpd: 'application/vnd.wordperfect',
    wpl: 'application/vnd.ms-wpl',
    wps: 'application/vnd.ms-works',
    wqd: 'application/vnd.wqd',
    wri: 'application/x-mswrite',
    wrl: 'model/vrml',
    wsdl: 'application/wsdl+xml',
    wspolicy: 'application/wspolicy+xml',
    wtb: 'application/vnd.webturbo',
    wvx: 'video/x-ms-wvx',
    x32: 'application/x-authorware-bin',
    x3d: 'application/vnd.hzn-3d-crossword',
    xap: 'application/x-silverlight-app',
    xar: 'application/vnd.xara',
    xbap: 'application/x-ms-xbap',
    xbd: 'application/vnd.fujixerox.docuworks.binder',
    xbm: 'image/x-xbitmap',
    xdf: 'application/xcap-diff+xml',
    xdm: 'application/vnd.syncml.dm+xml',
    xdp: 'application/vnd.adobe.xdp+xml',
    xdssc: 'application/dssc+xml',
    xdw: 'application/vnd.fujixerox.docuworks',
    xenc: 'application/xenc+xml',
    xer: 'application/patch-ops-error+xml',
    xfdf: 'application/vnd.adobe.xfdf',
    xfdl: 'application/vnd.xfdl',
    xht: 'application/xhtml+xml',
    xhtml: 'application/xhtml+xml',
    xhvml: 'application/xv+xml',
    xif: 'image/vnd.xiff',
    xla: 'application/vnd.ms-excel',
    xlam: 'application/vnd.ms-excel.addin.macroenabled.12',
    xlc: 'application/vnd.ms-excel',
    xlm: 'application/vnd.ms-excel',
    xls: 'application/vnd.ms-excel',
    xlsb: 'application/vnd.ms-excel.sheet.binary.macroenabled.12',
    xlsm: 'application/vnd.ms-excel.sheet.macroenabled.12',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xlt: 'application/vnd.ms-excel',
    xltm: 'application/vnd.ms-excel.template.macroenabled.12',
    xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    xlw: 'application/vnd.ms-excel',
    xml: 'application/xml',
    xo: 'application/vnd.olpc-sugar',
    xop: 'application/xop+xml',
    xpi: 'application/x-xpinstall',
    xpm: 'image/x-xpixmap',
    xpr: 'application/vnd.is-xpr',
    xps: 'application/vnd.ms-xpsdocument',
    xpw: 'application/vnd.intercon.formnet',
    xpx: 'application/vnd.intercon.formnet',
    xsl: 'application/xml',
    xslt: 'application/xslt+xml',
    xsm: 'application/vnd.syncml+xml',
    xspf: 'application/xspf+xml',
    xul: 'application/vnd.mozilla.xul+xml',
    xvm: 'application/xv+xml',
    xvml: 'application/xv+xml',
    xwd: 'image/x-xwindowdump',
    xyz: 'chemical/x-xyz',
    yaml: 'text/yaml',
    yang: 'application/yang',
    yin: 'application/yin+xml',
    yml: 'text/yaml',
    zaz: 'application/vnd.zzazz.deck+xml',
    zip: 'application/zip',
    zir: 'application/vnd.zul',
    zirz: 'application/vnd.zul',
    zmm: 'application/vnd.handheld-entertainment+xml',
    tmx: 'application/x-tmx',
    tbx: 'application/x-tbx',
};
class UploadStorage extends core_1.CrowdinApi {
    /**
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listStorages(limit, offset) {
        const url = `${this.url}/storages`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param fileName file name
     * @param request binary file data
     * @param contentType content type header
     */
    addStorage(fileName, request, contentType) {
        const url = `${this.url}/storages`;
        const config = this.defaultConfig();
        config.headers['Crowdin-API-FileName'] = fileName;
        if (!!contentType) {
            config.headers['Content-Type'] = contentType;
        }
        else {
            const fileNameParts = fileName.split('.');
            let contentType;
            if (fileNameParts.length > 1) {
                const fileExtrension = fileNameParts[fileNameParts.length - 1];
                contentType = mimetypes[fileExtrension];
            }
            config.headers['Content-Type'] = contentType || 'application/octet-stream';
        }
        return this.post(url, request, config);
    }
    /**
     * @param storageId storage identifier
     */
    getStorage(storageId) {
        const url = `${this.url}/storages/${storageId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param storageId storage identifier
     */
    deleteStorage(storageId) {
        const url = `${this.url}/storages/${storageId}`;
        return this.delete(url, this.defaultConfig());
    }
}
exports.UploadStorage = UploadStorage;


/***/ }),

/***/ 4374:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModel = exports.Users = void 0;
const core_1 = __nccwpck_require__(4735);
class Users extends core_1.CrowdinApi {
    /**
     *
     * @param projectId project identifier
     * @param search search users by firstName, lastName or username
     * @param role defines role type
     * @param languageId language identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listProjectMembers(projectId, search, role, languageId, limit, offset) {
        let url = `${this.url}/projects/${projectId}/members`;
        url = this.addQueryParam(url, 'search', search);
        url = this.addQueryParam(url, 'role', role);
        url = this.addQueryParam(url, 'languageId', languageId);
        return this.getList(url, limit, offset);
    }
    /**
     *
     * @param projectId project identifier
     * @param request request body
     */
    addProjectMember(projectId, request) {
        const url = `${this.url}/projects/${projectId}/members`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     *
     * @param projectId project identifier
     * @param memberId member identifier
     */
    getProjectMemberPermissions(projectId, memberId) {
        const url = `${this.url}/projects/${projectId}/members/${memberId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     *
     * @param projectId project identifier
     * @param memberId member identifier
     */
    replaceProjectMemberPermissions(projectId, memberId, request) {
        const url = `${this.url}/projects/${projectId}/members/${memberId}`;
        return this.put(url, request, this.defaultConfig());
    }
    /**
     *
     * @param projectId project identifier
     * @param memberId member identifier
     */
    deleteMemberFromProject(projectId, memberId) {
        const url = `${this.url}/projects/${projectId}/members/${memberId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param status filter users by status
     * @param search search users by firstName, lastName, username, email
     * @param twoFactor filter users by two-factor authentication status
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listUsers(status, search, twoFactor, limit, offset) {
        let url = `${this.url}/users`;
        url = this.addQueryParam(url, 'status', status);
        url = this.addQueryParam(url, 'search', search);
        url = this.addQueryParam(url, 'twoFactor', twoFactor);
        return this.getList(url, limit, offset);
    }
    /**
     * @param userId user identifier
     */
    getUserInfo(userId) {
        const url = `${this.url}/users/${userId}`;
        return this.get(url, this.defaultConfig());
    }
    getAuthenticatedUser() {
        const url = `${this.url}/user`;
        return this.get(url, this.defaultConfig());
    }
}
exports.Users = Users;
var UsersModel;
(function (UsersModel) {
    let Status;
    (function (Status) {
        Status["ACTIVE"] = "active";
        Status["PENDING"] = "pending";
        Status["BLOCKED"] = "blocked";
    })(Status = UsersModel.Status || (UsersModel.Status = {}));
    let TwoFactor;
    (function (TwoFactor) {
        TwoFactor["ENABLED"] = "enabled";
        TwoFactor["DISABLED"] = "disabled";
    })(TwoFactor = UsersModel.TwoFactor || (UsersModel.TwoFactor = {}));
    let Role;
    (function (Role) {
        Role["ALL"] = "all";
        Role["MANAGER"] = "manager";
        Role["PROOFREADER"] = "proofreader";
        Role["TRANSLATOR"] = "translator";
        Role["BLOCKED"] = "blocked";
    })(Role = UsersModel.Role || (UsersModel.Role = {}));
})(UsersModel = exports.UsersModel || (exports.UsersModel = {}));


/***/ }),

/***/ 4315:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vendors = void 0;
const core_1 = __nccwpck_require__(4735);
class Vendors extends core_1.CrowdinApi {
    /**
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listVendors(limit, offset) {
        const url = `${this.url}/vendors`;
        return this.getList(url, limit, offset);
    }
}
exports.Vendors = Vendors;


/***/ }),

/***/ 4596:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebhooksModel = exports.Webhooks = void 0;
const core_1 = __nccwpck_require__(4735);
class Webhooks extends core_1.CrowdinApi {
    /**
     * @param projectId project identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listWebhooks(projectId, limit, offset) {
        const url = `${this.url}/projects/${projectId}/webhooks`;
        return this.getList(url, limit, offset);
    }
    /**
     * @param projectId project identifier
     * @param request request body
     */
    addWebhook(projectId, request) {
        const url = `${this.url}/projects/${projectId}/webhooks`;
        return this.post(url, request, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param webhookId webhook identifier
     */
    getWebhook(projectId, webhookId) {
        const url = `${this.url}/projects/${projectId}/webhooks/${webhookId}`;
        return this.get(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param webhookId webhook identifier
     */
    deleteWebhook(projectId, webhookId) {
        const url = `${this.url}/projects/${projectId}/webhooks/${webhookId}`;
        return this.delete(url, this.defaultConfig());
    }
    /**
     * @param projectId project identifier
     * @param webhookId webhook identifier
     * @param request request body
     */
    editWebhook(projectId, webhookId, request) {
        const url = `${this.url}/projects/${projectId}/webhooks/${webhookId}`;
        return this.patch(url, request, this.defaultConfig());
    }
}
exports.Webhooks = Webhooks;
var WebhooksModel;
(function (WebhooksModel) {
    let ContentType;
    (function (ContentType) {
        ContentType["MULTIPART_FORM_DATA"] = "multipart/form-data";
        ContentType["APPLICATION_JSON"] = "application/json";
        ContentType["APPLICATION_X_WWW_FORM_URLENCODED"] = "application/x-www-form-urlencoded";
    })(ContentType = WebhooksModel.ContentType || (WebhooksModel.ContentType = {}));
    let Event;
    (function (Event) {
        Event["FILE_TRANSLATED"] = "file.translated";
        Event["FILE_APPROVED"] = "file.approved";
        Event["PROJECT_TRANSLATED"] = "project.translated";
        Event["PROJECT_APPROVED"] = "project.approved";
        Event["TRANSLATION_UPDATED"] = "translation.updated";
        Event["SUGGESTION_ADDED"] = "suggestion.added";
        Event["SUGGESTION_UPDATED"] = "suggestion.updated";
        Event["SUGGESTION_DELETED"] = "suggestion.deleted";
        Event["SUGGESTION_APPROVED"] = "suggestion.approved";
        Event["SUGGESTION_DISAPPROVED"] = "suggestion.disapproved";
    })(Event = WebhooksModel.Event || (WebhooksModel.Event = {}));
    let RequestType;
    (function (RequestType) {
        RequestType["POST"] = "POST";
        RequestType["GET"] = "GET";
    })(RequestType = WebhooksModel.RequestType || (WebhooksModel.RequestType = {}));
})(WebhooksModel = exports.WebhooksModel || (exports.WebhooksModel = {}));


/***/ }),

/***/ 2906:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Workflows = void 0;
const core_1 = __nccwpck_require__(4735);
class Workflows extends core_1.CrowdinApi {
    /**
     * @param groupId group identifier
     * @param limit maximum number of items to retrieve (default 25)
     * @param offset starting offset in the collection (default 0)
     */
    listWorkflowTemplates(groupId, limit, offset) {
        let url = `${this.url}/workflow-templates`;
        url = this.addQueryParam(url, 'groupId', groupId);
        return this.getList(url, limit, offset);
    }
    /**
     * @param templateId workflow template identifier
     */
    getWorkflowTemplateInfo(templateId) {
        const url = `${this.url}/workflow-templates/${templateId}`;
        return this.get(url, this.defaultConfig());
    }
}
exports.Workflows = Workflows;


/***/ }),

/***/ 3465:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Utils = __nccwpck_require__(4305);
const pth = __nccwpck_require__(5622);
const ZipEntry = __nccwpck_require__(847);
const ZipFile = __nccwpck_require__(3019);

const fs = Utils.FileSystem.require();
fs.existsSync = fs.existsSync || pth.existsSync;

const defaultOptions = {
    // read entries during load (initial loading may be slower)
    readEntries: false,
    // default method is none
    method: Utils.Constants.NONE
}

function canonical(p) {
    // trick normalize think path is absolute
    var safeSuffix = pth.posix.normalize("/" + p.split("\\").join("/"));
    return pth.join(".", safeSuffix);
}

module.exports = function (/**String*/input, /** object */options) {
    let inBuffer = null;

    // create object based default options, allowing them to be overwritten
    const opts = Object.assign(Object.create( null ), defaultOptions);

    // test input variable
    if (input && "object" === typeof input){
        // if value is not buffer we accept it to be object with options
        if (!(input instanceof Uint8Array)){
            Object.assign(opts, input);
            input = opts.input ? opts.input : undefined;
            if (opts.input) delete opts.input;
        }

        // if input is buffer
        if (input instanceof Uint8Array){
            inBuffer = input;
            opts.method = Utils.Constants.BUFFER;
            input = undefined;
        }
    }

    // assign options
    Object.assign(opts, options);

    // if input is file name we retrieve its content
    if (input && "string" === typeof input) {
        // load zip file
        if (fs.existsSync(input)) {
            opts.method = Utils.Constants.FILE;
            opts.filename = input;
            inBuffer = fs.readFileSync(input);
        } else {
            throw new Error(Utils.Errors.INVALID_FILENAME);
        }
    }

    // create variable
    const _zip = new ZipFile(inBuffer, opts);

    function sanitize(prefix, name) {
        prefix = pth.resolve(pth.normalize(prefix));
        var parts = name.split('/');
        for (var i = 0, l = parts.length; i < l; i++) {
            var path = pth.normalize(pth.join(prefix, parts.slice(i, l).join(pth.sep)));
            if (path.indexOf(prefix) === 0) {
                return path;
            }
        }
        return pth.normalize(pth.join(prefix, pth.basename(name)));
    }

	function getEntry(/**Object*/entry) {
		if (entry && _zip) {
			var item;
			// If entry was given as a file name
			if (typeof entry === "string")
				item = _zip.getEntry(entry);
			// if entry was given as a ZipEntry object
			if (typeof entry === "object" && typeof entry.entryName !== "undefined" && typeof entry.header !== "undefined")
				item = _zip.getEntry(entry.entryName);

			if (item) {
				return item;
			}
		}
		return null;
	}

    function fixPath(zipPath){
        const { join, normalize, sep } = pth.posix;
        // convert windows file separators and normalize
        return join(".", normalize(sep + zipPath.split("\\").join(sep) + sep));
    }

	return {
		/**
		 * Extracts the given entry from the archive and returns the content as a Buffer object
		 * @param entry ZipEntry object or String with the full path of the entry
		 *
		 * @return Buffer or Null in case of error
		 */
		readFile: function (/**Object*/entry, /*String, Buffer*/pass) {
			var item = getEntry(entry);
			return item && item.getData(pass) || null;
		},

		/**
		 * Asynchronous readFile
		 * @param entry ZipEntry object or String with the full path of the entry
		 * @param callback
		 *
		 * @return Buffer or Null in case of error
		 */
		readFileAsync: function (/**Object*/entry, /**Function*/callback) {
			var item = getEntry(entry);
			if (item) {
				item.getDataAsync(callback);
			} else {
				callback(null, "getEntry failed for:" + entry)
			}
		},

		/**
		 * Extracts the given entry from the archive and returns the content as plain text in the given encoding
		 * @param entry ZipEntry object or String with the full path of the entry
		 * @param encoding Optional. If no encoding is specified utf8 is used
		 *
		 * @return String
		 */
		readAsText: function (/**Object*/entry, /**String=*/encoding) {
			var item = getEntry(entry);
			if (item) {
				var data = item.getData();
				if (data && data.length) {
					return data.toString(encoding || "utf8");
				}
			}
			return "";
		},

		/**
		 * Asynchronous readAsText
		 * @param entry ZipEntry object or String with the full path of the entry
		 * @param callback
		 * @param encoding Optional. If no encoding is specified utf8 is used
		 *
		 * @return String
		 */
		readAsTextAsync: function (/**Object*/entry, /**Function*/callback, /**String=*/encoding) {
			var item = getEntry(entry);
			if (item) {
				item.getDataAsync(function (data, err) {
					if (err) {
						callback(data, err);
						return;
					}

					if (data && data.length) {
						callback(data.toString(encoding || "utf8"));
					} else {
						callback("");
					}
				})
			} else {
				callback("");
			}
		},

		/**
		 * Remove the entry from the file or the entry and all it's nested directories and files if the given entry is a directory
		 *
		 * @param entry
		 */
		deleteFile: function (/**Object*/entry) { // @TODO: test deleteFile
			var item = getEntry(entry);
			if (item) {
				_zip.deleteEntry(item.entryName);
			}
		},

		/**
		 * Adds a comment to the zip. The zip must be rewritten after adding the comment.
		 *
		 * @param comment
		 */
		addZipComment: function (/**String*/comment) { // @TODO: test addZipComment
			_zip.comment = comment;
		},

		/**
		 * Returns the zip comment
		 *
		 * @return String
		 */
		getZipComment: function () {
			return _zip.comment || '';
		},

		/**
		 * Adds a comment to a specified zipEntry. The zip must be rewritten after adding the comment
		 * The comment cannot exceed 65535 characters in length
		 *
		 * @param entry
		 * @param comment
		 */
		addZipEntryComment: function (/**Object*/entry, /**String*/comment) {
			var item = getEntry(entry);
			if (item) {
				item.comment = comment;
			}
		},

		/**
		 * Returns the comment of the specified entry
		 *
		 * @param entry
		 * @return String
		 */
		getZipEntryComment: function (/**Object*/entry) {
			var item = getEntry(entry);
			if (item) {
				return item.comment || '';
			}
			return ''
		},

		/**
		 * Updates the content of an existing entry inside the archive. The zip must be rewritten after updating the content
		 *
		 * @param entry
		 * @param content
		 */
		updateFile: function (/**Object*/entry, /**Buffer*/content) {
			var item = getEntry(entry);
			if (item) {
				item.setData(content);
			}
		},

		/**
		 * Adds a file from the disk to the archive
		 *
		 * @param localPath File to add to zip
		 * @param zipPath Optional path inside the zip
		 * @param zipName Optional name for the file
		 */
		addLocalFile: function (/**String*/localPath, /**String=*/zipPath, /**String=*/zipName, /**String*/comment) {
			if (fs.existsSync(localPath)) {
				// fix ZipPath
				zipPath = (zipPath) ? fixPath(zipPath) : "";

				// p - local file name
				var p = localPath.split("\\").join("/").split("/").pop();

				// add file name into zippath
				zipPath += (zipName) ? zipName : p;

				// read file attributes
				const _attr = fs.statSync(localPath);

				// add file into zip file
				this.addFile(zipPath, fs.readFileSync(localPath), comment, _attr)
			} else {
				throw new Error(Utils.Errors.FILE_NOT_FOUND.replace("%s", localPath));
			}
		},

		/**
		 * Adds a local directory and all its nested files and directories to the archive
		 *
		 * @param localPath
		 * @param zipPath optional path inside zip
		 * @param filter optional RegExp or Function if files match will
		 *               be included.
		 */
        addLocalFolder: function (/**String*/localPath, /**String=*/zipPath, /**=RegExp|Function*/filter) {
            // Prepare filter
            if (filter instanceof RegExp) {                 // if filter is RegExp wrap it
                filter = (function (rx){
                    return function (filename) {
                        return rx.test(filename);
                    }
                })(filter);
            } else if ('function' !== typeof filter) {       // if filter is not function we will replace it
                filter = function () {
                    return true;
                };
            }

            // fix ZipPath
            zipPath = (zipPath) ? fixPath(zipPath) : "";

            // normalize the path first
            localPath = pth.normalize(localPath);

            if (fs.existsSync(localPath)) {

                var items = Utils.findFiles(localPath),
                    self = this;

                if (items.length) {
                    items.forEach(function (filepath) {
                        var p = pth.relative(localPath, filepath).split("\\").join("/"); //windows fix
                        if (filter(p)) {
                            var stats = fs.statSync(filepath);
                            if (stats.isFile()) {
                                self.addFile(zipPath + p, fs.readFileSync(filepath), "", stats);
                            } else {
                                self.addFile(zipPath + p + '/', Buffer.alloc(0), "", stats);
                            }
                        }
                    });
                }
            } else {
                throw new Error(Utils.Errors.FILE_NOT_FOUND.replace("%s", localPath));
            }
        },

		/**
		 * Asynchronous addLocalFile
		 * @param localPath
		 * @param callback
		 * @param zipPath optional path inside zip
		 * @param filter optional RegExp or Function if files match will
		 *               be included.
		 */
        addLocalFolderAsync: function (/*String*/localPath, /*Function*/callback, /*String*/zipPath, /*RegExp|Function*/filter) {
            if (filter instanceof RegExp) {
                filter = (function (rx) {
                    return function (filename) {
                        return rx.test(filename);
                    };
                })(filter);
            } else if ("function" !== typeof filter) {
                filter = function () {
                    return true;
                };
            }

            // fix ZipPath
            zipPath = zipPath ? fixPath(zipPath) : "";

            // normalize the path first
            localPath = pth.normalize(localPath);

            var self = this;
            fs.open(localPath, 'r', function (err) {
                if (err && err.code === 'ENOENT') {
                    callback(undefined, Utils.Errors.FILE_NOT_FOUND.replace("%s", localPath));
                } else if (err) {
                    callback(undefined, err);
                } else {
                    var items = Utils.findFiles(localPath);
                    var i = -1;

                    var next = function () {
                        i += 1;
                        if (i < items.length) {
                            var filepath = items[i];
                            var p = pth.relative(localPath, filepath).split("\\").join("/"); //windows fix
                            p = p.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, '') // accent fix
                            if (filter(p)) {
                                fs.stat(filepath, function (er0, stats) {
                                    if (er0) callback(undefined, er0);
                                    if (stats.isFile()) {
                                        fs.readFile(filepath, function (er1, data) {
                                            if (er1) {
                                                callback(undefined, er1);
                                            } else {
                                                self.addFile(zipPath + p, data, "", stats);
                                                next();
                                            }
                                        });
                                    } else {
                                        self.addFile(zipPath + p + "/", Buffer.alloc(0), "", stats);
                                        next();
                                    }
                                });
                            } else {
                                next();
                            }

                        } else {
                            callback(true, undefined);
                        }
                    }

                    next();
                }
            });
        },

        addLocalFolderPromise: function (/*String*/ localPath, /* object */ options) {
            return new Promise((resolve, reject) => {
                const { filter, zipPath } = Object.assign({}, options);
                this.addLocalFolderAsync(localPath,
                    (done, err) => {
                        if (err) reject(err);
                        if (done) resolve(this);
                    }, zipPath, filter
                );
            });
        },

        /**
         * Allows you to create a entry (file or directory) in the zip file.
         * If you want to create a directory the entryName must end in / and a null buffer should be provided.
         * Comment and attributes are optional
         *
         * @param {string} entryName
         * @param {Buffer | string} content - file content as buffer or utf8 coded string
         * @param {string} comment - file comment
         * @param {number | object} attr - number as unix file permissions, object as filesystem Stats object
         */
        addFile: function (/**String*/ entryName, /**Buffer*/ content, /**String*/ comment, /**Number*/ attr) {
            let entry = getEntry(entryName);
            const update = entry != null;

            // prepare new entry
            if (!update){
                entry = new ZipEntry();
                entry.entryName = entryName;
            }
            entry.comment = comment || "";

            const isStat = ('object' === typeof attr) && (attr instanceof fs.Stats);

            // last modification time from file stats
            if (isStat){
                entry.header.time = attr.mtime;
            }

            // Set file attribute
            var fileattr = (entry.isDirectory) ? 0x10 : 0;  // (MS-DOS directory flag)

            // extended attributes field for Unix
            if('win32' !== process.platform){
                // set file type either S_IFDIR / S_IFREG
                let unix = (entry.isDirectory) ? 0x4000 : 0x8000;

                if (isStat) {                                       // File attributes from file stats
                    unix |= (0xfff & attr.mode);
                }else if ('number' === typeof attr){                // attr from given attr values
                    unix |= (0xfff & attr);
                }else{                                              // Default values:
                    unix |= (entry.isDirectory) ? 0o755 : 0o644;    // permissions (drwxr-xr-x) or (-r-wr--r--)
                }

                fileattr = (fileattr | (unix << 16)) >>> 0;         // add attributes
            }

            entry.attr = fileattr;

            entry.setData(content);
            if (!update) _zip.setEntry(entry);
        },

		/**
		 * Returns an array of ZipEntry objects representing the files and folders inside the archive
		 *
		 * @return Array
		 */
		getEntries: function () {
			if (_zip) {
				return _zip.entries;
			} else {
				return [];
			}
		},

		/**
		 * Returns a ZipEntry object representing the file or folder specified by ``name``.
		 *
		 * @param name
		 * @return ZipEntry
		 */
		getEntry: function (/**String*/name) {
			return getEntry(name);
		},

		getEntryCount: function() {
			return _zip.getEntryCount();
		},

		forEach: function(callback) {
			return _zip.forEach(callback);
		},

		/**
		 * Extracts the given entry to the given targetPath
		 * If the entry is a directory inside the archive, the entire directory and it's subdirectories will be extracted
		 *
		 * @param entry ZipEntry object or String with the full path of the entry
		 * @param targetPath Target folder where to write the file
		 * @param maintainEntryPath If maintainEntryPath is true and the entry is inside a folder, the entry folder
		 *                          will be created in targetPath as well. Default is TRUE
		 * @param overwrite If the file already exists at the target path, the file will be overwriten if this is true.
		 *                  Default is FALSE
         * @param outFileName String If set will override the filename of the extracted file (Only works if the entry is a file)
		 *
		 * @return Boolean
		 */
		extractEntryTo: function (/**Object*/entry, /**String*/targetPath, /**Boolean*/maintainEntryPath, /**Boolean*/overwrite, /**String**/outFileName) {
			overwrite = overwrite || false;
			maintainEntryPath = typeof maintainEntryPath === "undefined" ? true : maintainEntryPath;

			var item = getEntry(entry);
			if (!item) {
				throw new Error(Utils.Errors.NO_ENTRY);
			}

			var entryName = canonical(item.entryName);

			var target = sanitize(targetPath,outFileName && !item.isDirectory ? outFileName : (maintainEntryPath ? entryName : pth.basename(entryName)));

			if (item.isDirectory) {
				target = pth.resolve(target, "..");
				var children = _zip.getEntryChildren(item);
				children.forEach(function (child) {
					if (child.isDirectory) return;
					var content = child.getData();
					if (!content) {
						throw new Error(Utils.Errors.CANT_EXTRACT_FILE);
					}
					var name = canonical(child.entryName)
					var childName = sanitize(targetPath, maintainEntryPath ? name : pth.basename(name));
					// The reverse operation for attr depend on method addFile()
					var fileAttr = child.attr ? (((child.attr >>> 0) | 0) >> 16) & 0xfff : 0;
					Utils.writeFileTo(childName, content, overwrite, fileAttr);
				});
				return true;
			}

			var content = item.getData();
			if (!content) throw new Error(Utils.Errors.CANT_EXTRACT_FILE);

			if (fs.existsSync(target) && !overwrite) {
				throw new Error(Utils.Errors.CANT_OVERRIDE);
			}
			// The reverse operation for attr depend on method addFile()
			var fileAttr = item.attr ? (((item.attr >>> 0) | 0) >> 16) & 0xfff : 0;
			Utils.writeFileTo(target, content, overwrite, fileAttr);

			return true;
		},

		/**
		 * Test the archive
		 *
		 */
		test: function (pass) {
			if (!_zip) {
				return false;
			}

			for (var entry in _zip.entries) {
				try {
					if (entry.isDirectory) {
						continue;
					}
					var content = _zip.entries[entry].getData(pass);
					if (!content) {
						return false;
					}
				} catch (err) {
					return false;
				}
			}
			return true;
		},

		/**
		 * Extracts the entire archive to the given location
		 *
		 * @param targetPath Target location
		 * @param overwrite If the file already exists at the target path, the file will be overwriten if this is true.
		 *                  Default is FALSE
		 */
		extractAllTo: function (/**String*/targetPath, /**Boolean*/overwrite, /*String, Buffer*/pass) {
			overwrite = overwrite || false;
			if (!_zip) {
				throw new Error(Utils.Errors.NO_ZIP);
			}
			_zip.entries.forEach(function (entry) {
				var entryName = sanitize(targetPath, canonical(entry.entryName.toString()));
				if (entry.isDirectory) {
					Utils.makeDir(entryName);
					return;
				}
				var content = entry.getData(pass);
				if (!content) {
					throw new Error(Utils.Errors.CANT_EXTRACT_FILE);
				}
				// The reverse operation for attr depend on method addFile()
				var fileAttr = entry.attr ? (((entry.attr >>> 0) | 0) >> 16) & 0xfff : 0;
				Utils.writeFileTo(entryName, content, overwrite, fileAttr);
				try {
					fs.utimesSync(entryName, entry.header.time, entry.header.time)
				} catch (err) {
					throw new Error(Utils.Errors.CANT_EXTRACT_FILE);
				}
			})
		},

		/**
		 * Asynchronous extractAllTo
		 *
		 * @param targetPath Target location
		 * @param overwrite If the file already exists at the target path, the file will be overwriten if this is true.
		 *                  Default is FALSE
		 * @param callback
		 */
		extractAllToAsync: function (/**String*/targetPath, /**Boolean*/overwrite, /**Function*/callback) {
			if (!callback) {
				callback = function() {}
			}
			overwrite = overwrite || false;
			if (!_zip) {
				callback(new Error(Utils.Errors.NO_ZIP));
				return;
			}

			var entries = _zip.entries;
			var i = entries.length;
			entries.forEach(function (entry) {
				if (i <= 0) return; // Had an error already

				var entryName = pth.normalize(canonical(entry.entryName.toString()));

				if (entry.isDirectory) {
					Utils.makeDir(sanitize(targetPath, entryName));
					if (--i === 0)
						callback(undefined);
					return;
				}
				entry.getDataAsync(function (content, err) {
					if (i <= 0) return;
					if (err) {
						callback(new Error(err));
						return;
					}
					if (!content) {
						i = 0;
						callback(new Error(Utils.Errors.CANT_EXTRACT_FILE));
						return;
					}

					// The reverse operation for attr depend on method addFile()
					var fileAttr = entry.attr ? (((entry.attr >>> 0) | 0) >> 16) & 0xfff : 0;
					Utils.writeFileToAsync(sanitize(targetPath, entryName), content, overwrite, fileAttr, function (succ) {
						try {
							fs.utimesSync(pth.resolve(targetPath, entryName), entry.header.time, entry.header.time);
						} catch (err) {
							callback(new Error('Unable to set utimes'));
						}
						if (i <= 0) return;
						if (!succ) {
							i = 0;
							callback(new Error('Unable to write'));
							return;
						}
						if (--i === 0)
							callback(undefined);
					});
				});
			})
		},

		/**
		 * Writes the newly created zip file to disk at the specified location or if a zip was opened and no ``targetFileName`` is provided, it will overwrite the opened zip
		 *
		 * @param targetFileName
		 * @param callback
		 */
		writeZip: function (/**String*/targetFileName, /**Function*/callback) {
			if (arguments.length === 1) {
				if (typeof targetFileName === "function") {
					callback = targetFileName;
					targetFileName = "";
				}
			}

			if (!targetFileName && opts.filename) {
				targetFileName = opts.filename;
			}
			if (!targetFileName) return;

			var zipData = _zip.compressToBuffer();
			if (zipData) {
				var ok = Utils.writeFileTo(targetFileName, zipData, true);
				if (typeof callback === 'function') callback(!ok ? new Error("failed") : null, "");
			}
		},

        writeZipPromise: function (/**String*/ targetFileName, /* object */ options) {
            const { overwrite, perm } = Object.assign({ overwrite: true }, options);

            return new Promise((resolve, reject) => {
                // find file name
                if (!targetFileName && opts.filename) targetFileName = opts.filename;
                if (!targetFileName) reject("ADM-ZIP: ZIP File Name Missing");

                this.toBufferPromise().then((zipData) => {
                    const ret = (done) => (done ? resolve(done) : reject("ADM-ZIP: Wasn't able to write zip file"));
                    Utils.writeFileToAsync(targetFileName, zipData, overwrite, perm, ret);
                }, reject);
            });
        },

        toBufferPromise: function () {
            return new Promise((resolve, reject) => {
                _zip.toAsyncBuffer(resolve, reject);
            });
        },

		/**
		 * Returns the content of the entire zip file as a Buffer object
		 *
		 * @return Buffer
		 */
		toBuffer: function (/**Function=*/onSuccess, /**Function=*/onFail, /**Function=*/onItemStart, /**Function=*/onItemEnd) {
			this.valueOf = 2;
			if (typeof onSuccess === "function") {
				_zip.toAsyncBuffer(onSuccess, onFail, onItemStart, onItemEnd);
				return null;
			}
			return _zip.compressToBuffer()
		}
	}
};


/***/ }),

/***/ 750:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Utils = __nccwpck_require__(4305),
    Constants = Utils.Constants;

/* The central directory file header */
module.exports = function () {
    var _verMade = 0x14,
        _version = 0x0A,
        _flags = 0,
        _method = 0,
        _time = 0,
        _crc = 0,
        _compressedSize = 0,
        _size = 0,
        _fnameLen = 0,
        _extraLen = 0,

        _comLen = 0,
        _diskStart = 0,
        _inattr = 0,
        _attr = 0,
        _offset = 0;

    switch(process.platform){
        case 'win32':
            _verMade |= 0x0A00;
        default:
            _verMade |= 0x0300;
    }

    var _dataHeader = {};

    function setTime(val) {
        val = new Date(val);
        _time = (val.getFullYear() - 1980 & 0x7f) << 25  // b09-16 years from 1980
            | (val.getMonth() + 1) << 21                 // b05-08 month
            | val.getDate() << 16                        // b00-04 hour

            // 2 bytes time
            | val.getHours() << 11    // b11-15 hour
            | val.getMinutes() << 5   // b05-10 minute
            | val.getSeconds() >> 1;  // b00-04 seconds divided by 2
    }

    setTime(+new Date());

    return {
        get made () { return _verMade; },
        set made (val) { _verMade = val; },

        get version () { return _version; },
        set version (val) { _version = val },

        get flags () { return _flags },
        set flags (val) { _flags = val; },

        get method () { return _method; },
        set method (val) {
            switch (val){
                case Constants.STORED:
                    this.version = 10;
                case Constants.DEFLATED:
                default:
                    this.version = 20;
            }
            _method = val;
            },

        get time () { return new Date(
            ((_time >> 25) & 0x7f) + 1980,
            ((_time >> 21) & 0x0f) - 1,
            (_time >> 16) & 0x1f,
            (_time >> 11) & 0x1f,
            (_time >> 5) & 0x3f,
            (_time & 0x1f) << 1
        );
        },
        set time (val) {
            setTime(val);
        },

        get crc () { return _crc; },
        set crc (val) { _crc = val; },

        get compressedSize () { return _compressedSize; },
        set compressedSize (val) { _compressedSize = val; },

        get size () { return _size; },
        set size (val) { _size = val; },

        get fileNameLength () { return _fnameLen; },
        set fileNameLength (val) { _fnameLen = val; },

        get extraLength () { return _extraLen },
        set extraLength (val) { _extraLen = val; },

        get commentLength () { return _comLen },
        set commentLength (val) { _comLen = val },

        get diskNumStart () { return _diskStart },
        set diskNumStart (val) { _diskStart = val },

        get inAttr () { return _inattr },
        set inAttr (val) { _inattr = val },

        get attr () { return _attr },
        set attr (val) { _attr = val },

        get offset () { return _offset },
        set offset (val) { _offset = val },

        get encripted () { return (_flags & 1) === 1 },

        get entryHeaderSize () {
            return Constants.CENHDR + _fnameLen + _extraLen + _comLen;
        },

        get realDataOffset () {
            return _offset + Constants.LOCHDR + _dataHeader.fnameLen + _dataHeader.extraLen;
        },

        get dataHeader () {
            return _dataHeader;
        },

        loadDataHeaderFromBinary : function(/*Buffer*/input) {
            var data = input.slice(_offset, _offset + Constants.LOCHDR);
            // 30 bytes and should start with "PK\003\004"
            if (data.readUInt32LE(0) !== Constants.LOCSIG) {
                throw new Error(Utils.Errors.INVALID_LOC);
            }
            _dataHeader = {
                // version needed to extract
                version : data.readUInt16LE(Constants.LOCVER),
                // general purpose bit flag
                flags : data.readUInt16LE(Constants.LOCFLG),
                // compression method
                method : data.readUInt16LE(Constants.LOCHOW),
                // modification time (2 bytes time, 2 bytes date)
                time : data.readUInt32LE(Constants.LOCTIM),
                // uncompressed file crc-32 value
                crc : data.readUInt32LE(Constants.LOCCRC),
                // compressed size
                compressedSize : data.readUInt32LE(Constants.LOCSIZ),
                // uncompressed size
                size : data.readUInt32LE(Constants.LOCLEN),
                // filename length
                fnameLen : data.readUInt16LE(Constants.LOCNAM),
                // extra field length
                extraLen : data.readUInt16LE(Constants.LOCEXT)
            }
        },

        loadFromBinary : function(/*Buffer*/data) {
            // data should be 46 bytes and start with "PK 01 02"
            if (data.length !== Constants.CENHDR || data.readUInt32LE(0) !== Constants.CENSIG) {
                throw new Error(Utils.Errors.INVALID_CEN);
            }
            // version made by
            _verMade = data.readUInt16LE(Constants.CENVEM);
            // version needed to extract
            _version = data.readUInt16LE(Constants.CENVER);
            // encrypt, decrypt flags
            _flags = data.readUInt16LE(Constants.CENFLG);
            // compression method
            _method = data.readUInt16LE(Constants.CENHOW);
            // modification time (2 bytes time, 2 bytes date)
            _time = data.readUInt32LE(Constants.CENTIM);
            // uncompressed file crc-32 value
            _crc = data.readUInt32LE(Constants.CENCRC);
            // compressed size
            _compressedSize = data.readUInt32LE(Constants.CENSIZ);
            // uncompressed size
            _size = data.readUInt32LE(Constants.CENLEN);
            // filename length
            _fnameLen = data.readUInt16LE(Constants.CENNAM);
            // extra field length
            _extraLen = data.readUInt16LE(Constants.CENEXT);
            // file comment length
            _comLen = data.readUInt16LE(Constants.CENCOM);
            // volume number start
            _diskStart = data.readUInt16LE(Constants.CENDSK);
            // internal file attributes
            _inattr = data.readUInt16LE(Constants.CENATT);
            // external file attributes
            _attr = data.readUInt32LE(Constants.CENATX);
            // LOC header offset
            _offset = data.readUInt32LE(Constants.CENOFF);
        },

        dataHeaderToBinary : function() {
            // LOC header size (30 bytes)
            var data = Buffer.alloc(Constants.LOCHDR);
            // "PK\003\004"
            data.writeUInt32LE(Constants.LOCSIG, 0);
            // version needed to extract
            data.writeUInt16LE(_version, Constants.LOCVER);
            // general purpose bit flag
            data.writeUInt16LE(_flags, Constants.LOCFLG);
            // compression method
            data.writeUInt16LE(_method, Constants.LOCHOW);
            // modification time (2 bytes time, 2 bytes date)
            data.writeUInt32LE(_time, Constants.LOCTIM);
            // uncompressed file crc-32 value
            data.writeUInt32LE(_crc, Constants.LOCCRC);
            // compressed size
            data.writeUInt32LE(_compressedSize, Constants.LOCSIZ);
            // uncompressed size
            data.writeUInt32LE(_size, Constants.LOCLEN);
            // filename length
            data.writeUInt16LE(_fnameLen, Constants.LOCNAM);
            // extra field length
            data.writeUInt16LE(_extraLen, Constants.LOCEXT);
            return data;
        },

        entryHeaderToBinary : function() {
            // CEN header size (46 bytes)
            var data = Buffer.alloc(Constants.CENHDR + _fnameLen + _extraLen + _comLen);
            // "PK\001\002"
            data.writeUInt32LE(Constants.CENSIG, 0);
            // version made by
            data.writeUInt16LE(_verMade, Constants.CENVEM);
            // version needed to extract
            data.writeUInt16LE(_version, Constants.CENVER);
            // encrypt, decrypt flags
            data.writeUInt16LE(_flags, Constants.CENFLG);
            // compression method
            data.writeUInt16LE(_method, Constants.CENHOW);
            // modification time (2 bytes time, 2 bytes date)
            data.writeUInt32LE(_time, Constants.CENTIM);
            // uncompressed file crc-32 value
            data.writeUInt32LE(_crc, Constants.CENCRC);
            // compressed size
            data.writeUInt32LE(_compressedSize, Constants.CENSIZ);
            // uncompressed size
            data.writeUInt32LE(_size, Constants.CENLEN);
            // filename length
            data.writeUInt16LE(_fnameLen, Constants.CENNAM);
            // extra field length
            data.writeUInt16LE(_extraLen, Constants.CENEXT);
            // file comment length
            data.writeUInt16LE(_comLen, Constants.CENCOM);
            // volume number start
            data.writeUInt16LE(_diskStart, Constants.CENDSK);
            // internal file attributes
            data.writeUInt16LE(_inattr, Constants.CENATT);
            // external file attributes
            data.writeUInt32LE(_attr, Constants.CENATX);
            // LOC header offset
            data.writeUInt32LE(_offset, Constants.CENOFF);
            // fill all with
            data.fill(0x00, Constants.CENHDR);
            return data;
        },

        toString : function() {
            return '{\n' +
                '\t"made" : ' + _verMade + ",\n" +
                '\t"version" : ' + _version + ",\n" +
                '\t"flags" : ' + _flags + ",\n" +
                '\t"method" : ' + Utils.methodToString(_method) + ",\n" +
                '\t"time" : ' + this.time + ",\n" +
                '\t"crc" : 0x' + _crc.toString(16).toUpperCase() + ",\n" +
                '\t"compressedSize" : ' + _compressedSize + " bytes,\n" +
                '\t"size" : ' + _size + " bytes,\n" +
                '\t"fileNameLength" : ' + _fnameLen + ",\n" +
                '\t"extraLength" : ' + _extraLen + " bytes,\n" +
                '\t"commentLength" : ' + _comLen + " bytes,\n" +
                '\t"diskNumStart" : ' + _diskStart + ",\n" +
                '\t"inAttr" : ' + _inattr + ",\n" +
                '\t"attr" : ' + _attr + ",\n" +
                '\t"offset" : ' + _offset + ",\n" +
                '\t"entryHeaderSize" : ' + (Constants.CENHDR + _fnameLen + _extraLen + _comLen) + " bytes\n" +
                '}';
        }
    }
};


/***/ }),

/***/ 484:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

exports.EntryHeader = __nccwpck_require__(750);
exports.MainHeader = __nccwpck_require__(8229);


/***/ }),

/***/ 8229:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Utils = __nccwpck_require__(4305),
    Constants = Utils.Constants;

/* The entries in the end of central directory */
module.exports = function () {
    var _volumeEntries = 0,
        _totalEntries = 0,
        _size = 0,
        _offset = 0,
        _commentLength = 0;

    return {
        get diskEntries () { return _volumeEntries },
        set diskEntries (/*Number*/val) { _volumeEntries = _totalEntries = val; },

        get totalEntries () { return _totalEntries },
        set totalEntries (/*Number*/val) { _totalEntries = _volumeEntries = val; },

        get size () { return _size },
        set size (/*Number*/val) { _size = val; },

        get offset () { return _offset },
        set offset (/*Number*/val) { _offset = val; },

        get commentLength () { return _commentLength },
        set commentLength (/*Number*/val) { _commentLength = val; },

        get mainHeaderSize () {
            return Constants.ENDHDR + _commentLength;
        },

        loadFromBinary : function(/*Buffer*/data) {
            // data should be 22 bytes and start with "PK 05 06"
            // or be 56+ bytes and start with "PK 06 06" for Zip64
            if ((data.length !== Constants.ENDHDR || data.readUInt32LE(0) !== Constants.ENDSIG) &&
                (data.length < Constants.ZIP64HDR || data.readUInt32LE(0) !== Constants.ZIP64SIG)) {

                throw new Error(Utils.Errors.INVALID_END);
            }

            if (data.readUInt32LE(0) === Constants.ENDSIG) {
                // number of entries on this volume
                _volumeEntries = data.readUInt16LE(Constants.ENDSUB);
                // total number of entries
                _totalEntries = data.readUInt16LE(Constants.ENDTOT);
                // central directory size in bytes
                _size = data.readUInt32LE(Constants.ENDSIZ);
                // offset of first CEN header
                _offset = data.readUInt32LE(Constants.ENDOFF);
                // zip file comment length
                _commentLength = data.readUInt16LE(Constants.ENDCOM);
            } else {
                // number of entries on this volume
                _volumeEntries = Utils.readBigUInt64LE(data, Constants.ZIP64SUB);
                // total number of entries
                _totalEntries = Utils.readBigUInt64LE(data, Constants.ZIP64TOT);
                // central directory size in bytes
                _size = Utils.readBigUInt64LE(data, Constants.ZIP64SIZ);
                // offset of first CEN header
                _offset = Utils.readBigUInt64LE(data, Constants.ZIP64OFF);

                _commentLength = 0;
            }

        },

        toBinary : function() {
           var b = Buffer.alloc(Constants.ENDHDR + _commentLength);
            // "PK 05 06" signature
            b.writeUInt32LE(Constants.ENDSIG, 0);
            b.writeUInt32LE(0, 4);
            // number of entries on this volume
            b.writeUInt16LE(_volumeEntries, Constants.ENDSUB);
            // total number of entries
            b.writeUInt16LE(_totalEntries, Constants.ENDTOT);
            // central directory size in bytes
            b.writeUInt32LE(_size, Constants.ENDSIZ);
            // offset of first CEN header
            b.writeUInt32LE(_offset, Constants.ENDOFF);
            // zip file comment length
            b.writeUInt16LE(_commentLength, Constants.ENDCOM);
            // fill comment memory with spaces so no garbage is left there
            b.fill(" ", Constants.ENDHDR);

            return b;
        },

        toString : function() {
            return '{\n' +
                '\t"diskEntries" : ' + _volumeEntries + ",\n" +
                '\t"totalEntries" : ' + _totalEntries + ",\n" +
                '\t"size" : ' + _size + " bytes,\n" +
                '\t"offset" : 0x' + _offset.toString(16).toUpperCase() + ",\n" +
                '\t"commentLength" : 0x' + _commentLength + "\n" +
            '}';
        }
    }
};

/***/ }),

/***/ 5809:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = function (/*Buffer*/inbuf) {

  var zlib = __nccwpck_require__(8761);
  
  var opts = {chunkSize: (parseInt(inbuf.length / 1024) + 1) * 1024};
  
  return {
    deflate: function () {
      return zlib.deflateRawSync(inbuf, opts);
    },

    deflateAsync: function (/*Function*/callback) {
      var tmp = zlib.createDeflateRaw(opts), parts = [], total = 0;
      tmp.on('data', function (data) {
        parts.push(data);
        total += data.length;
      });
      tmp.on('end', function () {
        var buf = Buffer.alloc(total), written = 0;
        buf.fill(0);
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          part.copy(buf, written);
          written += part.length;
        }
        callback && callback(buf);
      });
      tmp.end(inbuf);
    }
  }
};


/***/ }),

/***/ 3601:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

exports.Deflater = __nccwpck_require__(5809);
exports.Inflater = __nccwpck_require__(5176);
exports.ZipCrypto = __nccwpck_require__(6788);

/***/ }),

/***/ 5176:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = function (/*Buffer*/inbuf) {

  var zlib = __nccwpck_require__(8761);

  return {
    inflate: function () {
      return zlib.inflateRawSync(inbuf);
    },

    inflateAsync: function (/*Function*/callback) {
      var tmp = zlib.createInflateRaw(), parts = [], total = 0;
      tmp.on('data', function (data) {
        parts.push(data);
        total += data.length;
      });
      tmp.on('end', function () {
        var buf = Buffer.alloc(total), written = 0;
        buf.fill(0);
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          part.copy(buf, written);
          written += part.length;
        }
        callback && callback(buf);
      });
      tmp.end(inbuf);
    }
  }
};


/***/ }),

/***/ 6788:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// node crypt, we use it for generate salt
const { randomFillSync } = __nccwpck_require__(6417);

"use strict";

// generate CRC32 lookup table
const crctable = new Uint32Array(256).map((t, crc) => {
    for (let j = 0; j < 8; j++) {
        if (0 !== (crc & 1)) {
            crc = (crc >>> 1) ^ 0xedb88320;
        } else {
            crc >>>= 1;
        }
    }
    return crc >>> 0;
});

// C-style uInt32 Multiply (discards higher bits, when JS multiply discards lower bits)
const uMul = (a, b) => Math.imul(a, b) >>> 0;

// crc32 byte single update (actually same function is part of utils.crc32 function :) )
const crc32update = (pCrc32, bval) => {
    return crctable[(pCrc32 ^ bval) & 0xff] ^ (pCrc32 >>> 8);
};

// function for generating salt for encrytion header
const genSalt = () => {
    if ("function" === typeof randomFillSync) {
        return randomFillSync(Buffer.alloc(12));
    } else {
        // fallback if function is not defined
        return genSalt.node();
    }
};

// salt generation with node random function (mainly as fallback)
genSalt.node = () => {
    const salt = Buffer.alloc(12);
    const len = salt.length;
    for (let i = 0; i < len; i++) salt[i] = (Math.random() * 256) & 0xff;
    return salt;
};

// general config
const config = {
    genSalt
};

// Class Initkeys handles same basic ops with keys
function Initkeys(pw) {
    const pass = Buffer.isBuffer(pw) ? pw : Buffer.from(pw);
    this.keys = new Uint32Array([0x12345678, 0x23456789, 0x34567890]);
    for (let i = 0; i < pass.length; i++) {
        this.updateKeys(pass[i]);
    }
}

Initkeys.prototype.updateKeys = function (byteValue) {
    const keys = this.keys;
    keys[0] = crc32update(keys[0], byteValue);
    keys[1] += keys[0] & 0xff;
    keys[1] = uMul(keys[1], 134775813) + 1;
    keys[2] = crc32update(keys[2], keys[1] >>> 24);
    return byteValue;
};

Initkeys.prototype.next = function () {
    const k = (this.keys[2] | 2) >>> 0; // key
    return (uMul(k, k ^ 1) >> 8) & 0xff; // decode
};

function make_decrypter(/*Buffer*/ pwd) {
    // 1. Stage initialize key
    const keys = new Initkeys(pwd);

    // return decrypter function
    return function (/*Buffer*/ data) {
        // result - we create new Buffer for results
        const result = Buffer.alloc(data.length);
        let pos = 0;
        // process input data
        for (let c of data) {
            //c ^= keys.next();
            //result[pos++] = c; // decode & Save Value
            result[pos++] = keys.updateKeys(c ^ keys.next()); // update keys with decoded byte
        }
        return result;
    };
}

function make_encrypter(/*Buffer*/ pwd) {
    // 1. Stage initialize key
    const keys = new Initkeys(pwd);

    // return encrypting function, result and pos is here so we dont have to merge buffers later
    return function (/*Buffer*/ data, /*Buffer*/ result, /* Number */ pos = 0) {
        // result - we create new Buffer for results
        if (!result) result = Buffer.alloc(data.length);
        // process input data
        for (let c of data) {
            const k = keys.next(); // save key byte
            result[pos++] = c ^ k; // save val
            keys.updateKeys(c); // update keys with decoded byte
        }
        return result;
    };
}

function decrypt(/*Buffer*/ data, /*Object*/ header, /*String, Buffer*/ pwd) {
    if (!data || !Buffer.isBuffer(data) || data.length < 12) {
        return Buffer.alloc(0);
    }

    // 1. We Initialize and generate decrypting function
    const decrypter = make_decrypter(pwd);

    // 2. decrypt salt what is always 12 bytes and is a part of file content
    const salt = decrypter(data.slice(0, 12));

    // 3. does password meet expectations
    if (salt[11] !== header.crc >>> 24) {
        throw "ADM-ZIP: Wrong Password";
    }

    // 4. decode content
    return decrypter(data.slice(12));
}

// lets add way to populate salt, NOT RECOMMENDED for production but maybe useful for testing general functionality
function _salter(data) {
    if (Buffer.isBuffer(data) && data.length >= 12) {
        // be aware - currently salting buffer data is modified
        config.genSalt = function () {
            return data.slice(0, 12);
        };
    } else if (data === "node") {
        // test salt generation with node random function
        config.genSalt = genSalt.node;
    } else {
        // if value is not acceptable config gets reset.
        config.genSalt = genSalt;
    }
}

function encrypt(/*Buffer*/ data, /*Object*/ header, /*String, Buffer*/ pwd, /*Boolean*/ oldlike = false) {
    // 1. test data if data is not Buffer we make buffer from it
    if (data == null) data = Buffer.alloc(0);
    // if data is not buffer be make buffer from it
    if (!Buffer.isBuffer(data)) data = Buffer.from(data.toString());

    // 2. We Initialize and generate encrypting function
    const encrypter = make_encrypter(pwd);

    // 3. generate salt (12-bytes of random data)
    const salt = config.genSalt();
    salt[11] = (header.crc >>> 24) & 0xff;

    // old implementations (before PKZip 2.04g) used two byte check
    if (oldlike) salt[10] = (header.crc >>> 16) & 0xff;

    // 4. create output
    const result = Buffer.alloc(data.length + 12);
    encrypter(salt, result);

    // finally encode content
    return encrypter(data, result, 12);
}

module.exports = { decrypt, encrypt, _salter };


/***/ }),

/***/ 1609:
/***/ ((module) => {

module.exports = {
    /* The local file header */
    LOCHDR           : 30, // LOC header size
    LOCSIG           : 0x04034b50, // "PK\003\004"
    LOCVER           : 4,	// version needed to extract
    LOCFLG           : 6, // general purpose bit flag
    LOCHOW           : 8, // compression method
    LOCTIM           : 10, // modification time (2 bytes time, 2 bytes date)
    LOCCRC           : 14, // uncompressed file crc-32 value
    LOCSIZ           : 18, // compressed size
    LOCLEN           : 22, // uncompressed size
    LOCNAM           : 26, // filename length
    LOCEXT           : 28, // extra field length

    /* The Data descriptor */
    EXTSIG           : 0x08074b50, // "PK\007\008"
    EXTHDR           : 16, // EXT header size
    EXTCRC           : 4, // uncompressed file crc-32 value
    EXTSIZ           : 8, // compressed size
    EXTLEN           : 12, // uncompressed size

    /* The central directory file header */
    CENHDR           : 46, // CEN header size
    CENSIG           : 0x02014b50, // "PK\001\002"
    CENVEM           : 4, // version made by
    CENVER           : 6, // version needed to extract
    CENFLG           : 8, // encrypt, decrypt flags
    CENHOW           : 10, // compression method
    CENTIM           : 12, // modification time (2 bytes time, 2 bytes date)
    CENCRC           : 16, // uncompressed file crc-32 value
    CENSIZ           : 20, // compressed size
    CENLEN           : 24, // uncompressed size
    CENNAM           : 28, // filename length
    CENEXT           : 30, // extra field length
    CENCOM           : 32, // file comment length
    CENDSK           : 34, // volume number start
    CENATT           : 36, // internal file attributes
    CENATX           : 38, // external file attributes (host system dependent)
    CENOFF           : 42, // LOC header offset

    /* The entries in the end of central directory */
    ENDHDR           : 22, // END header size
    ENDSIG           : 0x06054b50, // "PK\005\006"
    ENDSUB           : 8, // number of entries on this disk
    ENDTOT           : 10, // total number of entries
    ENDSIZ           : 12, // central directory size in bytes
    ENDOFF           : 16, // offset of first CEN header
    ENDCOM           : 20, // zip file comment length

    END64HDR         : 20, // zip64 END header size
    END64SIG         : 0x07064b50, // zip64 Locator signature, "PK\006\007"
    END64START       : 4, // number of the disk with the start of the zip64
    END64OFF         : 8, // relative offset of the zip64 end of central directory
    END64NUMDISKS    : 16, // total number of disks

    ZIP64SIG         : 0x06064b50, // zip64 signature, "PK\006\006"
    ZIP64HDR         : 56, // zip64 record minimum size
    ZIP64LEAD        : 12, // leading bytes at the start of the record, not counted by the value stored in ZIP64SIZE
    ZIP64SIZE        : 4, // zip64 size of the central directory record
    ZIP64VEM         : 12, // zip64 version made by
    ZIP64VER         : 14, // zip64 version needed to extract
    ZIP64DSK         : 16, // zip64 number of this disk
    ZIP64DSKDIR      : 20, // number of the disk with the start of the record directory
    ZIP64SUB         : 24, // number of entries on this disk
    ZIP64TOT         : 32, // total number of entries
    ZIP64SIZB        : 40, // zip64 central directory size in bytes
    ZIP64OFF         : 48, // offset of start of central directory with respect to the starting disk number
    ZIP64EXTRA       : 56, // extensible data sector

    /* Compression methods */
    STORED           : 0, // no compression
    SHRUNK           : 1, // shrunk
    REDUCED1         : 2, // reduced with compression factor 1
    REDUCED2         : 3, // reduced with compression factor 2
    REDUCED3         : 4, // reduced with compression factor 3
    REDUCED4         : 5, // reduced with compression factor 4
    IMPLODED         : 6, // imploded
    // 7 reserved
    DEFLATED         : 8, // deflated
    ENHANCED_DEFLATED: 9, // enhanced deflated
    PKWARE           : 10,// PKWare DCL imploded
    // 11 reserved
    BZIP2            : 12, //  compressed using BZIP2
    // 13 reserved
    LZMA             : 14, // LZMA
    // 15-17 reserved
    IBM_TERSE        : 18, // compressed using IBM TERSE
    IBM_LZ77         : 19, //IBM LZ77 z

    /* General purpose bit flag */
    FLG_ENC          : 0,  // encripted file
    FLG_COMP1        : 1,  // compression option
    FLG_COMP2        : 2,  // compression option
    FLG_DESC         : 4,  // data descriptor
    FLG_ENH          : 8,  // enhanced deflation
    FLG_STR          : 16, // strong encryption
    FLG_LNG          : 1024, // language encoding
    FLG_MSK          : 4096, // mask header values

    /* Load type */
    FILE             : 2,
    BUFFER           : 1,
    NONE             : 0,

    /* 4.5 Extensible data fields */
    EF_ID            : 0,
    EF_SIZE          : 2,

    /* Header IDs */
    ID_ZIP64         : 0x0001,
    ID_AVINFO        : 0x0007,
    ID_PFS           : 0x0008,
    ID_OS2           : 0x0009,
    ID_NTFS          : 0x000a,
    ID_OPENVMS       : 0x000c,
    ID_UNIX          : 0x000d,
    ID_FORK          : 0x000e,
    ID_PATCH         : 0x000f,
    ID_X509_PKCS7    : 0x0014,
    ID_X509_CERTID_F : 0x0015,
    ID_X509_CERTID_C : 0x0016,
    ID_STRONGENC     : 0x0017,
    ID_RECORD_MGT    : 0x0018,
    ID_X509_PKCS7_RL : 0x0019,
    ID_IBM1          : 0x0065,
    ID_IBM2          : 0x0066,
    ID_POSZIP        : 0x4690,

    EF_ZIP64_OR_32   : 0xffffffff,
    EF_ZIP64_OR_16   : 0xffff,
    EF_ZIP64_SUNCOMP : 0,
    EF_ZIP64_SCOMP   : 8,
    EF_ZIP64_RHO     : 16,
    EF_ZIP64_DSN     : 24
};


/***/ }),

/***/ 1883:
/***/ ((module) => {

module.exports = {
    /* Header error messages */
    "INVALID_LOC" : "Invalid LOC header (bad signature)",
    "INVALID_CEN" : "Invalid CEN header (bad signature)",
    "INVALID_END" : "Invalid END header (bad signature)",

    /* ZipEntry error messages*/
    "NO_DATA" : "Nothing to decompress",
    "BAD_CRC" : "CRC32 checksum failed",
    "FILE_IN_THE_WAY" : "There is a file in the way: %s",
    "UNKNOWN_METHOD" : "Invalid/unsupported compression method",

    /* Inflater error messages */
    "AVAIL_DATA" : "inflate::Available inflate data did not terminate",
    "INVALID_DISTANCE" : "inflate::Invalid literal/length or distance code in fixed or dynamic block",
    "TO_MANY_CODES" : "inflate::Dynamic block code description: too many length or distance codes",
    "INVALID_REPEAT_LEN" : "inflate::Dynamic block code description: repeat more than specified lengths",
    "INVALID_REPEAT_FIRST" : "inflate::Dynamic block code description: repeat lengths with no first length",
    "INCOMPLETE_CODES" : "inflate::Dynamic block code description: code lengths codes incomplete",
    "INVALID_DYN_DISTANCE": "inflate::Dynamic block code description: invalid distance code lengths",
    "INVALID_CODES_LEN": "inflate::Dynamic block code description: invalid literal/length code lengths",
    "INVALID_STORE_BLOCK" : "inflate::Stored block length did not match one's complement",
    "INVALID_BLOCK_TYPE" : "inflate::Invalid block type (type == 3)",

    /* ADM-ZIP error messages */
    "CANT_EXTRACT_FILE" : "Could not extract the file",
    "CANT_OVERRIDE" : "Target file already exists",
    "NO_ZIP" : "No zip file was loaded",
    "NO_ENTRY" : "Entry doesn't exist",
    "DIRECTORY_CONTENT_ERROR" : "A directory cannot have content",
    "FILE_NOT_FOUND" : "File not found: %s",
    "NOT_IMPLEMENTED" : "Not implemented",
    "INVALID_FILENAME" : "Invalid filename",
    "INVALID_FORMAT" : "Invalid or unsupported zip format. No END header found"
};

/***/ }),

/***/ 849:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(98).require(),
    pth = __nccwpck_require__(5622);
	
fs.existsSync = fs.existsSync || pth.existsSync;

module.exports = function(/*String*/path) {

    var _path = path || "",
        _permissions = 0,
        _obj = newAttr(),
        _stat = null;

    function newAttr() {
        return {
            directory : false,
            readonly : false,
            hidden : false,
            executable : false,
            mtime : 0,
            atime : 0
        }
    }

    if (_path && fs.existsSync(_path)) {
        _stat = fs.statSync(_path);
        _obj.directory = _stat.isDirectory();
        _obj.mtime = _stat.mtime;
        _obj.atime = _stat.atime;
        _obj.executable = (0o111 & _stat.mode) != 0;    // file is executable who ever har right not just owner
        _obj.readonly   = (0o200 & _stat.mode) == 0;    // readonly if owner has no write right
        _obj.hidden = pth.basename(_path)[0] === ".";
    } else {
        console.warn("Invalid path: " + _path)
    }

    return {

        get directory () {
            return _obj.directory;
        },

        get readOnly () {
            return _obj.readonly;
        },

        get hidden () {
            return _obj.hidden;
        },

        get mtime () {
            return _obj.mtime;
        },

        get atime () {
           return _obj.atime;
        },


        get executable () {
            return _obj.executable;
        },

        decodeAttributes : function(val) {

        },

        encodeAttributes : function (val) {

        },

        toString : function() {
           return '{\n' +
               '\t"path" : "' + _path + ",\n" +
               '\t"isDirectory" : ' + _obj.directory + ",\n" +
               '\t"isReadOnly" : ' + _obj.readonly + ",\n" +
               '\t"isHidden" : ' + _obj.hidden + ",\n" +
               '\t"isExecutable" : ' + _obj.executable + ",\n" +
               '\t"mTime" : ' + _obj.mtime + "\n" +
               '\t"aTime" : ' + _obj.atime + "\n" +
           '}';
        }
    }

};


/***/ }),

/***/ 98:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

exports.require = function() {
  var fs = __nccwpck_require__(5747);
  if (process && process.versions && process.versions['electron']) {
	  try {
	    originalFs = __nccwpck_require__(2161);
	    if (Object.keys(originalFs).length > 0) {
	      fs = originalFs;
      }
	  } catch (e) {}
  }
  return fs
};


/***/ }),

/***/ 4305:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(7702);
module.exports.FileSystem = __nccwpck_require__(98);
module.exports.Constants = __nccwpck_require__(1609);
module.exports.Errors = __nccwpck_require__(1883);
module.exports.FileAttr = __nccwpck_require__(849);

/***/ }),

/***/ 7702:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(98).require(),
    pth = __nccwpck_require__(5622);

fs.existsSync = fs.existsSync || pth.existsSync;

module.exports = (function() {

    var crcTable = [],
        Constants = __nccwpck_require__(1609),
        Errors = __nccwpck_require__(1883),

        PATH_SEPARATOR = pth.sep;


    function mkdirSync(/*String*/path) {
        var resolvedPath = path.split(PATH_SEPARATOR)[0];
        path.split(PATH_SEPARATOR).forEach(function(name) {
            if (!name || name.substr(-1,1) === ":") return;
            resolvedPath += PATH_SEPARATOR + name;
            var stat;
            try {
                stat = fs.statSync(resolvedPath);
            } catch (e) {
                fs.mkdirSync(resolvedPath);
            }
            if (stat && stat.isFile())
                throw Errors.FILE_IN_THE_WAY.replace("%s", resolvedPath);
        });
    }

    function findSync(/*String*/dir, /*RegExp*/pattern, /*Boolean*/recoursive) {
        if (typeof pattern === 'boolean') {
            recoursive = pattern;
            pattern = undefined;
        }
        var files = [];
        fs.readdirSync(dir).forEach(function(file) {
            var path = pth.join(dir, file);

            if (fs.statSync(path).isDirectory() && recoursive)
                files = files.concat(findSync(path, pattern, recoursive));

            if (!pattern || pattern.test(path)) {
                files.push(pth.normalize(path) + (fs.statSync(path).isDirectory() ? PATH_SEPARATOR : ""));
            }

        });
        return files;
    }

    function readBigUInt64LE(/*Buffer*/buffer, /*int*/index) {
        var slice = Buffer.from(buffer.slice(index, index + 8));
        slice.swap64();

        return parseInt(`0x${ slice.toString('hex') }`);
    }

    return {
        makeDir : function(/*String*/path) {
            mkdirSync(path);
        },

        crc32 : function(buf) {
            if (typeof buf === 'string') {
                buf = Buffer.from(buf);
            }
            var b = Buffer.alloc(4);
            if (!crcTable.length) {
                for (var n = 0; n < 256; n++) {
                    var c = n;
                    for (var k = 8; --k >= 0;)  //
                        if ((c & 1) !== 0)  { c = 0xedb88320 ^ (c >>> 1); } else { c = c >>> 1; }
                    if (c < 0) {
                        b.writeInt32LE(c, 0);
                        c = b.readUInt32LE(0);
                    }
                    crcTable[n] = c;
                }
            }
            var crc = 0, off = 0, len = buf.length, c1 = ~crc;
            while(--len >= 0) c1 = crcTable[(c1 ^ buf[off++]) & 0xff] ^ (c1 >>> 8);
            crc = ~c1;
            b.writeInt32LE(crc & 0xffffffff, 0);
            return b.readUInt32LE(0);
        },

        methodToString : function(/*Number*/method) {
            switch (method) {
                case Constants.STORED:
                    return 'STORED (' + method + ')';
                case Constants.DEFLATED:
                    return 'DEFLATED (' + method + ')';
                default:
                    return 'UNSUPPORTED (' + method + ')';
            }

        },

        writeFileTo : function(/*String*/path, /*Buffer*/content, /*Boolean*/overwrite, /*Number*/attr) {
            if (fs.existsSync(path)) {
                if (!overwrite)
                    return false; // cannot overwrite

                var stat = fs.statSync(path);
                if (stat.isDirectory()) {
                    return false;
                }
            }
            var folder = pth.dirname(path);
            if (!fs.existsSync(folder)) {
                mkdirSync(folder);
            }

            var fd;
            try {
                fd = fs.openSync(path, 'w', 438); // 0666
            } catch(e) {
                fs.chmodSync(path, 438);
                fd = fs.openSync(path, 'w', 438);
            }
            if (fd) {
                try {
                    fs.writeSync(fd, content, 0, content.length, 0);
                }
                catch (e){
                    throw e;
                }
                finally {
                    fs.closeSync(fd);
                }
            }
            fs.chmodSync(path, attr || 438);
            return true;
        },

        writeFileToAsync : function(/*String*/path, /*Buffer*/content, /*Boolean*/overwrite, /*Number*/attr, /*Function*/callback) {
            if(typeof attr === 'function') {
                callback = attr;
                attr = undefined;
            }

            fs.exists(path, function(exists) {
                if(exists && !overwrite)
                    return callback(false);

                fs.stat(path, function(err, stat) {
                    if(exists &&stat.isDirectory()) {
                        return callback(false);
                    }

                    var folder = pth.dirname(path);
                    fs.exists(folder, function(exists) {
                        if(!exists)
                            mkdirSync(folder);

                        fs.open(path, 'w', 438, function(err, fd) {
                            if(err) {
                                fs.chmod(path, 438, function() {
                                    fs.open(path, 'w', 438, function(err, fd) {
                                        fs.write(fd, content, 0, content.length, 0, function() {
                                            fs.close(fd, function() {
                                                fs.chmod(path, attr || 438, function() {
                                                    callback(true);
                                                })
                                            });
                                        });
                                    });
                                })
                            } else {
                                if(fd) {
                                    fs.write(fd, content, 0, content.length, 0, function() {
                                        fs.close(fd, function() {
                                            fs.chmod(path, attr || 438, function() {
                                                callback(true);
                                            })
                                        });
                                    });
                                } else {
                                    fs.chmod(path, attr || 438, function() {
                                        callback(true);
                                    })
                                }
                            }
                        });
                    })
                })
            })
        },

        findFiles : function(/*String*/path) {
            return findSync(path, true);
        },

        getAttributes : function(/*String*/path) {

        },

        setAttributes : function(/*String*/path) {

        },

        toBuffer : function(input) {
            if (Buffer.isBuffer(input)) {
                return input;
            } else {
                if (input.length === 0) {
                    return Buffer.alloc(0)
                }
                return Buffer.from(input, 'utf8');
            }
        },

        readBigUInt64LE,

        Constants : Constants,
        Errors : Errors
    }
})();


/***/ }),

/***/ 847:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Utils = __nccwpck_require__(4305),
    Headers = __nccwpck_require__(484),
    Constants = Utils.Constants,
    Methods = __nccwpck_require__(3601);

module.exports = function (/*Buffer*/input) {
    var _entryHeader = new Headers.EntryHeader(),
        _entryName = Buffer.alloc(0),
        _comment = Buffer.alloc(0),
        _isDirectory = false,
        uncompressedData = null,
        _extra = Buffer.alloc(0);

    function getCompressedDataFromZip() {
        if (!input || !Buffer.isBuffer(input)) {
            return Buffer.alloc(0);
        }
        _entryHeader.loadDataHeaderFromBinary(input);
        return input.slice(_entryHeader.realDataOffset, _entryHeader.realDataOffset + _entryHeader.compressedSize)
    }

    function crc32OK(data) {
        // if bit 3 (0x08) of the general-purpose flags field is set, then the CRC-32 and file sizes are not known when the header is written
        if ((_entryHeader.flags & 0x8) !== 0x8) {
           if (Utils.crc32(data) !== _entryHeader.dataHeader.crc) {
               return false;
           }
        } else {
            // @TODO: load and check data descriptor header
            // The fields in the local header are filled with zero, and the CRC-32 and size are appended in a 12-byte structure
            // (optionally preceded by a 4-byte signature) immediately after the compressed data:
        }
        return true;
    }

    function decompress(/*Boolean*/async, /*Function*/callback, /*String, Buffer*/pass) {
        if(typeof callback === 'undefined' && typeof async === 'string') {
            pass=async;
            async=void 0;
        }
        if (_isDirectory) {
            if (async && callback) {
                callback(Buffer.alloc(0), Utils.Errors.DIRECTORY_CONTENT_ERROR); //si added error.
            }
            return Buffer.alloc(0);
        }

        var compressedData = getCompressedDataFromZip();

        if (compressedData.length === 0) {
            // File is empty, nothing to decompress.
            if (async && callback) callback(compressedData);
            return compressedData;
        }

        if (_entryHeader.encripted){
            if ('string' !== typeof pass && !Buffer.isBuffer(pass)){
                throw new Error('ADM-ZIP: Incompatible password parameter');
            }
            compressedData = Methods.ZipCrypto.decrypt(compressedData, _entryHeader, pass);
        }

        var data = Buffer.alloc(_entryHeader.size);

        switch (_entryHeader.method) {
            case Utils.Constants.STORED:
                compressedData.copy(data);
                if (!crc32OK(data)) {
                    if (async && callback) callback(data, Utils.Errors.BAD_CRC);//si added error
                    throw new Error(Utils.Errors.BAD_CRC);
                } else {//si added otherwise did not seem to return data.
                    if (async && callback) callback(data);
                    return data;
                }
            case Utils.Constants.DEFLATED:
                var inflater = new Methods.Inflater(compressedData);
                if (!async) {
                    var result = inflater.inflate(data);
                    result.copy(data, 0);
                    if (!crc32OK(data)) {
                        throw new Error(Utils.Errors.BAD_CRC + " " + _entryName.toString());
                    }
                    return data;
                } else {
                    inflater.inflateAsync(function(result) {
                        result.copy(data, 0);
                        if (!crc32OK(data)) {
                            if (callback) callback(data, Utils.Errors.BAD_CRC); //si added error
                        } else { //si added otherwise did not seem to return data.
                            if (callback) callback(data);
                        }
                    });
                }
                break;
            default:
                if (async && callback) callback(Buffer.alloc(0), Utils.Errors.UNKNOWN_METHOD);
                throw new Error(Utils.Errors.UNKNOWN_METHOD);
        }
    }

    function compress(/*Boolean*/async, /*Function*/callback) {
        if ((!uncompressedData || !uncompressedData.length) && Buffer.isBuffer(input)) {
            // no data set or the data wasn't changed to require recompression
            if (async && callback) callback(getCompressedDataFromZip());
            return getCompressedDataFromZip();
        }

        if (uncompressedData.length && !_isDirectory) {
            var compressedData;
            // Local file header
            switch (_entryHeader.method) {
                case Utils.Constants.STORED:
                    _entryHeader.compressedSize = _entryHeader.size;

                    compressedData = Buffer.alloc(uncompressedData.length);
                    uncompressedData.copy(compressedData);

                    if (async && callback) callback(compressedData);
                    return compressedData;
                default:
                case Utils.Constants.DEFLATED:

                    var deflater = new Methods.Deflater(uncompressedData);
                    if (!async) {
                        var deflated = deflater.deflate();
                        _entryHeader.compressedSize = deflated.length;
                        return deflated;
                    } else {
                        deflater.deflateAsync(function(data) {
                            compressedData = Buffer.alloc(data.length);
                            _entryHeader.compressedSize = data.length;
                            data.copy(compressedData);
                            callback && callback(compressedData);
                        });
                    }
                    deflater = null;
                    break;
            }
        } else {
            if (async && callback) {
                callback(Buffer.alloc(0));
            } else {
                return Buffer.alloc(0);
            }
        }
    }

    function readUInt64LE(buffer, offset) {
        return (buffer.readUInt32LE(offset + 4) << 4) + buffer.readUInt32LE(offset);
    }

    function parseExtra(data) {
        var offset = 0;
        var signature, size, part;
        while(offset<data.length) {
            signature = data.readUInt16LE(offset);
            offset += 2;
            size = data.readUInt16LE(offset);
            offset += 2;
            part = data.slice(offset, offset+size);
            offset += size;
            if(Constants.ID_ZIP64 === signature) {
                parseZip64ExtendedInformation(part);
            }
        }
    }

    //Override header field values with values from the ZIP64 extra field
    function parseZip64ExtendedInformation(data) {
        var size, compressedSize, offset, diskNumStart;

        if(data.length >= Constants.EF_ZIP64_SCOMP) {
            size = readUInt64LE(data, Constants.EF_ZIP64_SUNCOMP);
            if(_entryHeader.size === Constants.EF_ZIP64_OR_32) {
                _entryHeader.size = size;
            }
        }
        if(data.length >= Constants.EF_ZIP64_RHO) {
            compressedSize = readUInt64LE(data, Constants.EF_ZIP64_SCOMP);
            if(_entryHeader.compressedSize === Constants.EF_ZIP64_OR_32) {
                _entryHeader.compressedSize = compressedSize;
            }
        }
        if(data.length >= Constants.EF_ZIP64_DSN) {
            offset = readUInt64LE(data, Constants.EF_ZIP64_RHO);
            if(_entryHeader.offset === Constants.EF_ZIP64_OR_32) {
                _entryHeader.offset = offset;
            }
        }
        if(data.length >= Constants.EF_ZIP64_DSN+4) {
            diskNumStart = data.readUInt32LE(Constants.EF_ZIP64_DSN);
            if(_entryHeader.diskNumStart === Constants.EF_ZIP64_OR_16) {
                _entryHeader.diskNumStart = diskNumStart;
            }
        }
    }


    return {
        get entryName () { return _entryName.toString(); },
        get rawEntryName() { return _entryName; },
        set entryName (val) {
            _entryName = Utils.toBuffer(val);
            var lastChar = _entryName[_entryName.length - 1];
            _isDirectory = (lastChar === 47) || (lastChar === 92);
            _entryHeader.fileNameLength = _entryName.length;
        },

        get extra () { return _extra; },
        set extra (val) {
            _extra = val;
            _entryHeader.extraLength = val.length;
            parseExtra(val);
        },

        get comment () { return _comment.toString(); },
        set comment (val) {
            _comment = Utils.toBuffer(val);
            _entryHeader.commentLength = _comment.length;
        },

        get name () { var n = _entryName.toString(); return _isDirectory ? n.substr(n.length - 1).split("/").pop() : n.split("/").pop(); },
        get isDirectory () { return _isDirectory },

        getCompressedData : function() {
            return compress(false, null)
        },

        getCompressedDataAsync : function(/*Function*/callback) {
            compress(true, callback)
        },

        setData : function(value) {
            uncompressedData = Utils.toBuffer(value);
            if (!_isDirectory && uncompressedData.length) {
                _entryHeader.size = uncompressedData.length;
                _entryHeader.method = Utils.Constants.DEFLATED;
                _entryHeader.crc = Utils.crc32(value);
                _entryHeader.changed = true;
            } else { // folders and blank files should be stored
                _entryHeader.method = Utils.Constants.STORED;
            }
        },

        getData : function(pass) {
            if (_entryHeader.changed) {
                return uncompressedData;
            } else {
                return decompress(false, null, pass);
            }
        },

        getDataAsync : function(/*Function*/callback, pass) {
            if (_entryHeader.changed) {
                callback(uncompressedData);
            } else {
                decompress(true, callback, pass);
            }
        },

        set attr(attr) { _entryHeader.attr = attr; },
        get attr() { return _entryHeader.attr; },

        set header(/*Buffer*/data) {
            _entryHeader.loadFromBinary(data);
        },

        get header() {
            return _entryHeader;
        },

        packHeader : function() {
            // 1. create header (buffer)
            var header = _entryHeader.entryHeaderToBinary();
            var addpos = Utils.Constants.CENHDR;
            // 2. add file name
            _entryName.copy(header, addpos);
            addpos += _entryName.length;
            // 3. add extra data
            if (_entryHeader.extraLength) {
                _extra.copy(header, addpos);
                addpos += _entryHeader.extraLength;
            }
            // 4. add file comment
            if (_entryHeader.commentLength) {
                _comment.copy(header, addpos);
            }
            return header;
        },

        toString : function() {
            return '{\n' +
                '\t"entryName" : "' + _entryName.toString() + "\",\n" +
                '\t"name" : "' + (_isDirectory ? _entryName.toString().replace(/\/$/, '').split("/").pop() : _entryName.toString().split("/").pop()) + "\",\n" +
                '\t"comment" : "' + _comment.toString() + "\",\n" +
                '\t"isDirectory" : ' + _isDirectory + ",\n" +
                '\t"header" : ' + _entryHeader.toString().replace(/\t/mg, "\t\t").replace(/}/mg, "\t}")  + ",\n" +
                '\t"compressedData" : <' + (input && input.length  + " bytes buffer" || "null") + ">\n" +
                '\t"data" : <' + (uncompressedData && uncompressedData.length  + " bytes buffer" || "null") + ">\n" +
                '}';
        }
    }
};


/***/ }),

/***/ 3019:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ZipEntry = __nccwpck_require__(847);
const Headers = __nccwpck_require__(484);
const Utils = __nccwpck_require__(4305);

module.exports = function (/*Buffer|null*/inBuffer, /** object */options) {
    var entryList = [],
        entryTable = {},
        _comment = Buffer.alloc(0),
        mainHeader = new Headers.MainHeader(),
        loadedEntries = false;

    // assign options
    const opts = Object.assign(Object.create(null), options);

    if (inBuffer){
        // is a memory buffer
        readMainHeader(opts.readEntries);
    } else {
        // none. is a new file
        loadedEntries = true;
    }

	function iterateEntries(callback) {
		const totalEntries = mainHeader.diskEntries; // total number of entries
		let index = mainHeader.offset; // offset of first CEN header

		for (let i = 0; i < totalEntries; i++) {
			let tmp = index;
			const entry = new ZipEntry(inBuffer);

			entry.header = inBuffer.slice(tmp, tmp += Utils.Constants.CENHDR);
			entry.entryName = inBuffer.slice(tmp, tmp += entry.header.fileNameLength);

			index += entry.header.entryHeaderSize;

			callback(entry);
		}
	}

	function readEntries() {
		loadedEntries = true;
		entryTable = {};
		entryList = new Array(mainHeader.diskEntries);  // total number of entries
		var index = mainHeader.offset;  // offset of first CEN header
		for (var i = 0; i < entryList.length; i++) {

			var tmp = index,
				entry = new ZipEntry(inBuffer);
			entry.header = inBuffer.slice(tmp, tmp += Utils.Constants.CENHDR);

			entry.entryName = inBuffer.slice(tmp, tmp += entry.header.fileNameLength);

			if (entry.header.extraLength) {
				entry.extra = inBuffer.slice(tmp, tmp += entry.header.extraLength);
			}

			if (entry.header.commentLength)
				entry.comment = inBuffer.slice(tmp, tmp + entry.header.commentLength);

			index += entry.header.entryHeaderSize;

			entryList[i] = entry;
			entryTable[entry.entryName] = entry;
		}
	}

    function readMainHeader(/*Boolean*/ readNow) {
		var i = inBuffer.length - Utils.Constants.ENDHDR, // END header size
			max = Math.max(0, i - 0xFFFF), // 0xFFFF is the max zip file comment length
			n = max,
			endStart = inBuffer.length,
			endOffset = -1, // Start offset of the END header
			commentEnd = 0;

		for (i; i >= n; i--) {
			if (inBuffer[i] !== 0x50) continue; // quick check that the byte is 'P'
			if (inBuffer.readUInt32LE(i) === Utils.Constants.ENDSIG) { // "PK\005\006"
				endOffset = i;
				commentEnd = i;
				endStart = i + Utils.Constants.ENDHDR;
				// We already found a regular signature, let's look just a bit further to check if there's any zip64 signature
				n = i - Utils.Constants.END64HDR;
				continue;
			}

			if (inBuffer.readUInt32LE(i) === Utils.Constants.END64SIG) {
				// Found a zip64 signature, let's continue reading the whole zip64 record
				n = max;
				continue;
			}

			if (inBuffer.readUInt32LE(i) == Utils.Constants.ZIP64SIG) {
				// Found the zip64 record, let's determine it's size
				endOffset = i;
				endStart = i + Utils.readBigUInt64LE(inBuffer, i + Utils.Constants.ZIP64SIZE) + Utils.Constants.ZIP64LEAD;
				break;
			}
		}

		if (!~endOffset)
			throw new Error(Utils.Errors.INVALID_FORMAT);

		mainHeader.loadFromBinary(inBuffer.slice(endOffset, endStart));
		if (mainHeader.commentLength) {
			_comment = inBuffer.slice(commentEnd + Utils.Constants.ENDHDR);
		}
        if (readNow) readEntries();
    }

	return {
		/**
		 * Returns an array of ZipEntry objects existent in the current opened archive
		 * @return Array
		 */
		get entries() {
			if (!loadedEntries) {
				readEntries();
			}
			return entryList;
		},

		/**
		 * Archive comment
		 * @return {String}
		 */
		get comment() {
			return _comment.toString();
		},
		set comment(val) {
			_comment = Utils.toBuffer(val);
			mainHeader.commentLength = _comment.length;
		},

		getEntryCount: function() {
			if (!loadedEntries) {
				return mainHeader.diskEntries;
			}

			return entryList.length;
		},

		forEach: function(callback) {
			if (!loadedEntries) {
				iterateEntries(callback);
				return;
			}

			entryList.forEach(callback);
		},

		/**
		 * Returns a reference to the entry with the given name or null if entry is inexistent
		 *
		 * @param entryName
		 * @return ZipEntry
		 */
		getEntry: function (/*String*/entryName) {
			if (!loadedEntries) {
				readEntries();
			}
			return entryTable[entryName] || null;
		},

		/**
		 * Adds the given entry to the entry list
		 *
		 * @param entry
		 */
		setEntry: function (/*ZipEntry*/entry) {
			if (!loadedEntries) {
				readEntries();
			}
			entryList.push(entry);
			entryTable[entry.entryName] = entry;
			mainHeader.totalEntries = entryList.length;
		},

		/**
		 * Removes the entry with the given name from the entry list.
		 *
		 * If the entry is a directory, then all nested files and directories will be removed
		 * @param entryName
		 */
		deleteEntry: function (/*String*/entryName) {
			if (!loadedEntries) {
				readEntries();
			}
			var entry = entryTable[entryName];
			if (entry && entry.isDirectory) {
				var _self = this;
				this.getEntryChildren(entry).forEach(function (child) {
					if (child.entryName !== entryName) {
						_self.deleteEntry(child.entryName)
					}
				})
			}
			entryList.splice(entryList.indexOf(entry), 1);
			delete(entryTable[entryName]);
			mainHeader.totalEntries = entryList.length;
		},

		/**
		 *  Iterates and returns all nested files and directories of the given entry
		 *
		 * @param entry
		 * @return Array
		 */
		getEntryChildren: function (/*ZipEntry*/entry) {
			if (!loadedEntries) {
				readEntries();
			}
			if (entry.isDirectory) {
				var list = [],
					name = entry.entryName,
					len = name.length;

				entryList.forEach(function (zipEntry) {
					if (zipEntry.entryName.substr(0, len) === name) {
						list.push(zipEntry);
					}
				});
				return list;
			}
			return []
		},

		/**
		 * Returns the zip file
		 *
		 * @return Buffer
		 */
		compressToBuffer: function () {
			if (!loadedEntries) {
				readEntries();
			}
			if (entryList.length > 1) {
				entryList.sort(function (a, b) {
					var nameA = a.entryName.toLowerCase();
					var nameB = b.entryName.toLowerCase();
					if (nameA < nameB) {
						return -1
					}
					if (nameA > nameB) {
						return 1
					}
					return 0;
				});
			}

			var totalSize = 0,
				dataBlock = [],
				entryHeaders = [],
				dindex = 0;

			mainHeader.size = 0;
			mainHeader.offset = 0;

			entryList.forEach(function (entry) {
				// compress data and set local and entry header accordingly. Reason why is called first
				var compressedData = entry.getCompressedData();
				// data header
				entry.header.offset = dindex;
				var dataHeader = entry.header.dataHeaderToBinary();
				var entryNameLen = entry.rawEntryName.length;
				var extra = entry.extra.toString();
				var postHeader = Buffer.alloc(entryNameLen + extra.length);
				entry.rawEntryName.copy(postHeader, 0);
				postHeader.fill(extra, entryNameLen);

				var dataLength = dataHeader.length + postHeader.length + compressedData.length;

				dindex += dataLength;

				dataBlock.push(dataHeader);
				dataBlock.push(postHeader);
				dataBlock.push(compressedData);

				var entryHeader = entry.packHeader();
				entryHeaders.push(entryHeader);
				mainHeader.size += entryHeader.length;
				totalSize += (dataLength + entryHeader.length);
			});

			totalSize += mainHeader.mainHeaderSize; // also includes zip file comment length
			// point to end of data and beginning of central directory first record
			mainHeader.offset = dindex;

			dindex = 0;
			var outBuffer = Buffer.alloc(totalSize);
			dataBlock.forEach(function (content) {
				content.copy(outBuffer, dindex); // write data blocks
				dindex += content.length;
			});
			entryHeaders.forEach(function (content) {
				content.copy(outBuffer, dindex); // write central directory entries
				dindex += content.length;
			});

			var mh = mainHeader.toBinary();
			if (_comment) {
				Buffer.from(_comment).copy(mh, Utils.Constants.ENDHDR); // add zip file comment
			}

			mh.copy(outBuffer, dindex); // write main header

			return outBuffer;
		},

		toAsyncBuffer: function (/*Function*/onSuccess, /*Function*/onFail, /*Function*/onItemStart, /*Function*/onItemEnd) {
			if (!loadedEntries) {
				readEntries();
			}
			if (entryList.length > 1) {
				entryList.sort(function (a, b) {
					var nameA = a.entryName.toLowerCase();
					var nameB = b.entryName.toLowerCase();
					if (nameA > nameB) {
						return -1
					}
					if (nameA < nameB) {
						return 1
					}
					return 0;
				});
			}

			var totalSize = 0,
				dataBlock = [],
				entryHeaders = [],
				dindex = 0;

			mainHeader.size = 0;
			mainHeader.offset = 0;

			var compress = function (entryList) {
				var self = arguments.callee;
				if (entryList.length) {
					var entry = entryList.pop();
					var name = entry.entryName + entry.extra.toString();
					if (onItemStart) onItemStart(name);
					entry.getCompressedDataAsync(function (compressedData) {
						if (onItemEnd) onItemEnd(name);

						entry.header.offset = dindex;
						// data header
						var dataHeader = entry.header.dataHeaderToBinary();
						var postHeader;
						try {
							postHeader = Buffer.alloc(name.length, name);  // using alloc will work on node  5.x+
						} catch(e){
							postHeader = new Buffer(name); // use deprecated method if alloc fails...
						}
						var dataLength = dataHeader.length + postHeader.length + compressedData.length;

						dindex += dataLength;

						dataBlock.push(dataHeader);
						dataBlock.push(postHeader);
						dataBlock.push(compressedData);

						var entryHeader = entry.packHeader();
						entryHeaders.push(entryHeader);
						mainHeader.size += entryHeader.length;
						totalSize += (dataLength + entryHeader.length);

						if (entryList.length) {
							self(entryList);
						} else {


							totalSize += mainHeader.mainHeaderSize; // also includes zip file comment length
							// point to end of data and beginning of central directory first record
							mainHeader.offset = dindex;

							dindex = 0;
							var outBuffer = Buffer.alloc(totalSize);
							dataBlock.forEach(function (content) {
								content.copy(outBuffer, dindex); // write data blocks
								dindex += content.length;
							});
							entryHeaders.forEach(function (content) {
								content.copy(outBuffer, dindex); // write central directory entries
								dindex += content.length;
							});

							var mh = mainHeader.toBinary();
							if (_comment) {
								_comment.copy(mh, Utils.Constants.ENDHDR); // add zip file comment
							}

							mh.copy(outBuffer, dindex); // write main header

							onSuccess(outBuffer);
						}
					});
				}
			};

			compress(entryList);
		}
	}
};


/***/ }),

/***/ 8577:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(2438);

/***/ }),

/***/ 8664:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);
var settle = __nccwpck_require__(3138);
var buildFullPath = __nccwpck_require__(7124);
var buildURL = __nccwpck_require__(6569);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var httpFollow = __nccwpck_require__(6170).http;
var httpsFollow = __nccwpck_require__(6170).https;
var url = __nccwpck_require__(8835);
var zlib = __nccwpck_require__(8761);
var pkg = __nccwpck_require__(2995);
var createError = __nccwpck_require__(1987);
var enhanceError = __nccwpck_require__(8575);

var isHttps = /https:?/;

/**
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} proxy
 * @param {string} location
 */
function setProxy(options, proxy, location) {
  options.hostname = proxy.host;
  options.host = proxy.host;
  options.port = proxy.port;
  options.path = location;

  // Basic proxy authorization
  if (proxy.auth) {
    var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
    options.headers['Proxy-Authorization'] = 'Basic ' + base64;
  }

  // If a proxy is used, any redirects must also pass through the proxy
  options.beforeRedirect = function beforeRedirect(redirection) {
    redirection.headers.host = redirection.host;
    setProxy(redirection, proxy, redirection.href);
  };
}

/*eslint consistent-return:0*/
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var resolve = function resolve(value) {
      resolvePromise(value);
    };
    var reject = function reject(value) {
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var fullPath = buildFullPath(config.baseURL, config.url);
    var parsed = url.parse(fullPath);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }

        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port,
            protocol: parsedProxyUrl.protocol
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      setProxy(options, proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;

      // return the last request in case of redirects
      var lastRequest = res.req || req;


      // if no content, is HEAD request or decompress disabled we should not decompress
      if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
        switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'compress':
        case 'deflate':
        // add the unzipper to the body stream processing pipeline
          stream = stream.pipe(zlib.createUnzip());

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        }
      }

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
            if (!config.responseEncoding || config.responseEncoding === 'utf8') {
              responseData = utils.stripBOM(responseData);
            }
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(config.timeout, function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      });
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};


/***/ }),

/***/ 8414:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);
var settle = __nccwpck_require__(3138);
var cookies = __nccwpck_require__(4723);
var buildURL = __nccwpck_require__(6569);
var buildFullPath = __nccwpck_require__(7124);
var parseHeaders = __nccwpck_require__(3159);
var isURLSameOrigin = __nccwpck_require__(7446);
var createError = __nccwpck_require__(1987);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 2438:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);
var bind = __nccwpck_require__(5228);
var Axios = __nccwpck_require__(9784);
var mergeConfig = __nccwpck_require__(3897);
var defaults = __nccwpck_require__(9410);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __nccwpck_require__(3910);
axios.CancelToken = __nccwpck_require__(587);
axios.isCancel = __nccwpck_require__(6283);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __nccwpck_require__(5432);

// Expose isAxiosError
axios.isAxiosError = __nccwpck_require__(6114);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ 3910:
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ 587:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var Cancel = __nccwpck_require__(3910);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 6283:
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 9784:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);
var buildURL = __nccwpck_require__(6569);
var InterceptorManager = __nccwpck_require__(64);
var dispatchRequest = __nccwpck_require__(4211);
var mergeConfig = __nccwpck_require__(3897);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ 64:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 7124:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var isAbsoluteURL = __nccwpck_require__(7879);
var combineURLs = __nccwpck_require__(7101);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 1987:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var enhanceError = __nccwpck_require__(8575);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ 4211:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);
var transformData = __nccwpck_require__(7517);
var isCancel = __nccwpck_require__(6283);
var defaults = __nccwpck_require__(9410);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 8575:
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ 3897:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ 3138:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var createError = __nccwpck_require__(1987);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 7517:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ 9410:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);
var normalizeHeaderName = __nccwpck_require__(10);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __nccwpck_require__(8414);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __nccwpck_require__(8664);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ 5228:
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 6569:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 7101:
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 4723:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 7879:
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 6114:
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ 7446:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 10:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 3159:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(1338);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 5432:
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 1338:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var bind = __nccwpck_require__(5228);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ 506:
/***/ ((module, exports, __nccwpck_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __nccwpck_require__(3935)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 3935:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __nccwpck_require__(4377);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 2512:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __nccwpck_require__(506);
} else {
	module.exports = __nccwpck_require__(5698);
}


/***/ }),

/***/ 5698:
/***/ ((module, exports, __nccwpck_require__) => {

/**
 * Module dependencies.
 */

const tty = __nccwpck_require__(3867);
const util = __nccwpck_require__(1669);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __nccwpck_require__(2227);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __nccwpck_require__(3935)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 9605:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var debug;

module.exports = function () {
  if (!debug) {
    try {
      /* eslint global-require: off */
      debug = __nccwpck_require__(2512)("follow-redirects");
    }
    catch (error) {
      debug = function () { /* */ };
    }
  }
  debug.apply(null, arguments);
};


/***/ }),

/***/ 6170:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var url = __nccwpck_require__(8835);
var URL = url.URL;
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var Writable = __nccwpck_require__(2413).Writable;
var assert = __nccwpck_require__(2357);
var debug = __nccwpck_require__(9605);

// Create handlers that pass events from native requests
var events = ["abort", "aborted", "connect", "error", "socket", "timeout"];
var eventHandlers = Object.create(null);
events.forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});

// Error types with codes
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  ""
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded"
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

RedirectableRequest.prototype.abort = function () {
  abortRequest(this._currentRequest);
  this.emit("abort");
};

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  }
  else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Write data if needed and end
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  }
  else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  var self = this;
  if (callback) {
    this.on("timeout", callback);
  }

  function destroyOnTimeout(socket) {
    socket.setTimeout(msecs);
    socket.removeListener("timeout", socket.destroy);
    socket.addListener("timeout", socket.destroy);
  }

  // Sets up a timer to trigger a timeout event
  function startTimer(socket) {
    if (self._timeout) {
      clearTimeout(self._timeout);
    }
    self._timeout = setTimeout(function () {
      self.emit("timeout");
      clearTimer();
    }, msecs);
    destroyOnTimeout(socket);
  }

  // Prevent a timeout from triggering
  function clearTimer() {
    clearTimeout(this._timeout);
    if (callback) {
      self.removeListener("timeout", callback);
    }
    if (!this.socket) {
      self._currentRequest.removeListener("socket", startTimer);
    }
  }

  // Start the timer when the socket is opened
  if (this.socket) {
    startTimer(this.socket);
  }
  else {
    this._currentRequest.once("socket", startTimer);
  }

  this.on("socket", destroyOnTimeout);
  this.once("response", clearTimer);
  this.once("error", clearTimer);

  return this;
};

// Proxy all other public ClientRequest methods
[
  "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  }

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};


// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url.format(this._options);

  // Set up event handlers
  request._redirectable = this;
  for (var e = 0; e < events.length; e++) {
    request.on(events[e], eventHandlers[events[e]]);
  }

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end.
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      /* istanbul ignore else */
      if (request === self._currentRequest) {
        // Report any write errors
        /* istanbul ignore if */
        if (error) {
          self.emit("error", error);
        }
        // Write the next buffer if there are still left
        else if (i < buffers.length) {
          var buffer = buffers[i++];
          /* istanbul ignore else */
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        }
        // End the request if `end` has been called on us
        else if (self._ended) {
          request.end();
        }
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.
  var location = response.headers.location;
  if (location && this._options.followRedirects !== false &&
      statusCode >= 300 && statusCode < 400) {
    // Abort the current request
    abortRequest(this._currentRequest);
    // Discard the remainder of the response to avoid waiting for data
    response.destroy();

    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new TooManyRedirectsError());
      return;
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
        // RFC7231§6.4.4: The 303 (See Other) status code indicates that
        // the server is redirecting the user agent to a different resource […]
        // A user agent can perform a retrieval request targeting that URI
        // (a GET or HEAD request if using HTTP) […]
        (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      removeMatchingHeaders(/^content-/i, this._options.headers);
    }

    // Drop the Host header, as the redirect might lead to a different host
    var previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers) ||
      url.parse(this._currentUrl).hostname;

    // Create the redirected request
    var redirectUrl = url.resolve(this._currentUrl, location);
    debug("redirecting to", redirectUrl);
    this._isRedirect = true;
    var redirectUrlParts = url.parse(redirectUrl);
    Object.assign(this._options, redirectUrlParts);

    // Drop the Authorization header if redirecting to another host
    if (redirectUrlParts.hostname !== previousHostName) {
      removeMatchingHeaders(/^authorization$/i, this._options.headers);
    }

    // Evaluate the beforeRedirect callback
    if (typeof this._options.beforeRedirect === "function") {
      var responseDetails = { headers: response.headers };
      try {
        this._options.beforeRedirect.call(null, this._options, responseDetails);
      }
      catch (err) {
        this.emit("error", err);
        return;
      }
      this._sanitizeOptions(this._options);
    }

    // Perform the redirected request
    try {
      this._performRequest();
    }
    catch (cause) {
      var error = new RedirectionError("Redirected request failed: " + cause.message);
      error.cause = cause;
      this.emit("error", error);
    }
  }
  else {
    // The response is not a redirect; return it as-is
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    function request(input, options, callback) {
      // Parse parameters
      if (typeof input === "string") {
        var urlStr = input;
        try {
          input = urlToOptions(new URL(urlStr));
        }
        catch (err) {
          /* istanbul ignore next */
          input = url.parse(urlStr);
        }
      }
      else if (URL && (input instanceof URL)) {
        input = urlToOptions(input);
      }
      else {
        callback = options;
        options = input;
        input = { protocol: protocol };
      }
      if (typeof options === "function") {
        callback = options;
        options = null;
      }

      // Set defaults
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength,
      }, input, options);
      options.nativeProtocols = nativeProtocols;

      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }

    // Executes a GET request, following redirects
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }

    // Expose the properties on the wrapped protocol
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true },
    });
  });
  return exports;
}

/* istanbul ignore next */
function noop() { /* empty */ }

// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
  var options = {
    protocol: urlObject.protocol,
    hostname: urlObject.hostname.startsWith("[") ?
      /* istanbul ignore next */
      urlObject.hostname.slice(1, -1) :
      urlObject.hostname,
    hash: urlObject.hash,
    search: urlObject.search,
    pathname: urlObject.pathname,
    path: urlObject.pathname + urlObject.search,
    href: urlObject.href,
  };
  if (urlObject.port !== "") {
    options.port = Number(urlObject.port);
  }
  return options;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return lastValue;
}

function createErrorType(code, defaultMessage) {
  function CustomError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.message = message || defaultMessage;
  }
  CustomError.prototype = new Error();
  CustomError.prototype.constructor = CustomError;
  CustomError.prototype.name = "Error [" + code + "]";
  CustomError.prototype.code = code;
  return CustomError;
}

function abortRequest(request) {
  for (var e = 0; e < events.length; e++) {
    request.removeListener(events[e], eventHandlers[events[e]]);
  }
  request.on("error", noop);
  request.abort();
}

// Exports
module.exports = wrap({ http: http, https: https });
module.exports.wrap = wrap;


/***/ }),

/***/ 4216:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(7905)
const path = __nccwpck_require__(5622)
const mkdirsSync = __nccwpck_require__(1470).mkdirsSync
const utimesMillisSync = __nccwpck_require__(1767).utimesMillisSync
const stat = __nccwpck_require__(7526)

function copySync (src, dest, opts) {
  if (typeof opts === 'function') {
    opts = { filter: opts }
  }

  opts = opts || {}
  opts.clobber = 'clobber' in opts ? !!opts.clobber : true // default to true for now
  opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber // overwrite falls back to clobber

  // Warn about using preserveTimestamps on 32-bit node
  if (opts.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`)
  }

  const { srcStat, destStat } = stat.checkPathsSync(src, dest, 'copy', opts)
  stat.checkParentPathsSync(src, srcStat, dest, 'copy')
  return handleFilterAndCopy(destStat, src, dest, opts)
}

function handleFilterAndCopy (destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest)) return
  const destParent = path.dirname(dest)
  if (!fs.existsSync(destParent)) mkdirsSync(destParent)
  return getStats(destStat, src, dest, opts)
}

function startCopy (destStat, src, dest, opts) {
  if (opts.filter && !opts.filter(src, dest)) return
  return getStats(destStat, src, dest, opts)
}

function getStats (destStat, src, dest, opts) {
  const statSync = opts.dereference ? fs.statSync : fs.lstatSync
  const srcStat = statSync(src)

  if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts)
  else if (srcStat.isFile() ||
           srcStat.isCharacterDevice() ||
           srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts)
  else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts)
  else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`)
  else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`)
  throw new Error(`Unknown file: ${src}`)
}

function onFile (srcStat, destStat, src, dest, opts) {
  if (!destStat) return copyFile(srcStat, src, dest, opts)
  return mayCopyFile(srcStat, src, dest, opts)
}

function mayCopyFile (srcStat, src, dest, opts) {
  if (opts.overwrite) {
    fs.unlinkSync(dest)
    return copyFile(srcStat, src, dest, opts)
  } else if (opts.errorOnExist) {
    throw new Error(`'${dest}' already exists`)
  }
}

function copyFile (srcStat, src, dest, opts) {
  fs.copyFileSync(src, dest)
  if (opts.preserveTimestamps) handleTimestamps(srcStat.mode, src, dest)
  return setDestMode(dest, srcStat.mode)
}

function handleTimestamps (srcMode, src, dest) {
  // Make sure the file is writable before setting the timestamp
  // otherwise open fails with EPERM when invoked with 'r+'
  // (through utimes call)
  if (fileIsNotWritable(srcMode)) makeFileWritable(dest, srcMode)
  return setDestTimestamps(src, dest)
}

function fileIsNotWritable (srcMode) {
  return (srcMode & 0o200) === 0
}

function makeFileWritable (dest, srcMode) {
  return setDestMode(dest, srcMode | 0o200)
}

function setDestMode (dest, srcMode) {
  return fs.chmodSync(dest, srcMode)
}

function setDestTimestamps (src, dest) {
  // The initial srcStat.atime cannot be trusted
  // because it is modified by the read(2) system call
  // (See https://nodejs.org/api/fs.html#fs_stat_time_values)
  const updatedSrcStat = fs.statSync(src)
  return utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime)
}

function onDir (srcStat, destStat, src, dest, opts) {
  if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts)
  return copyDir(src, dest, opts)
}

function mkDirAndCopy (srcMode, src, dest, opts) {
  fs.mkdirSync(dest)
  copyDir(src, dest, opts)
  return setDestMode(dest, srcMode)
}

function copyDir (src, dest, opts) {
  fs.readdirSync(src).forEach(item => copyDirItem(item, src, dest, opts))
}

function copyDirItem (item, src, dest, opts) {
  const srcItem = path.join(src, item)
  const destItem = path.join(dest, item)
  const { destStat } = stat.checkPathsSync(srcItem, destItem, 'copy', opts)
  return startCopy(destStat, srcItem, destItem, opts)
}

function onLink (destStat, src, dest, opts) {
  let resolvedSrc = fs.readlinkSync(src)
  if (opts.dereference) {
    resolvedSrc = path.resolve(process.cwd(), resolvedSrc)
  }

  if (!destStat) {
    return fs.symlinkSync(resolvedSrc, dest)
  } else {
    let resolvedDest
    try {
      resolvedDest = fs.readlinkSync(dest)
    } catch (err) {
      // dest exists and is a regular file or directory,
      // Windows may throw UNKNOWN error. If dest already exists,
      // fs throws error anyway, so no need to guard against it here.
      if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return fs.symlinkSync(resolvedSrc, dest)
      throw err
    }
    if (opts.dereference) {
      resolvedDest = path.resolve(process.cwd(), resolvedDest)
    }
    if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
      throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`)
    }

    // prevent copy if src is a subdir of dest since unlinking
    // dest in this case would result in removing src contents
    // and therefore a broken symlink would be created.
    if (fs.statSync(dest).isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
      throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`)
    }
    return copyLink(resolvedSrc, dest)
  }
}

function copyLink (resolvedSrc, dest) {
  fs.unlinkSync(dest)
  return fs.symlinkSync(resolvedSrc, dest)
}

module.exports = copySync


/***/ }),

/***/ 582:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = {
  copySync: __nccwpck_require__(4216)
}


/***/ }),

/***/ 8400:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(7905)
const path = __nccwpck_require__(5622)
const mkdirs = __nccwpck_require__(1470).mkdirs
const pathExists = __nccwpck_require__(1382).pathExists
const utimesMillis = __nccwpck_require__(1767).utimesMillis
const stat = __nccwpck_require__(7526)

function copy (src, dest, opts, cb) {
  if (typeof opts === 'function' && !cb) {
    cb = opts
    opts = {}
  } else if (typeof opts === 'function') {
    opts = { filter: opts }
  }

  cb = cb || function () {}
  opts = opts || {}

  opts.clobber = 'clobber' in opts ? !!opts.clobber : true // default to true for now
  opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber // overwrite falls back to clobber

  // Warn about using preserveTimestamps on 32-bit node
  if (opts.preserveTimestamps && process.arch === 'ia32') {
    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n
    see https://github.com/jprichardson/node-fs-extra/issues/269`)
  }

  stat.checkPaths(src, dest, 'copy', opts, (err, stats) => {
    if (err) return cb(err)
    const { srcStat, destStat } = stats
    stat.checkParentPaths(src, srcStat, dest, 'copy', err => {
      if (err) return cb(err)
      if (opts.filter) return handleFilter(checkParentDir, destStat, src, dest, opts, cb)
      return checkParentDir(destStat, src, dest, opts, cb)
    })
  })
}

function checkParentDir (destStat, src, dest, opts, cb) {
  const destParent = path.dirname(dest)
  pathExists(destParent, (err, dirExists) => {
    if (err) return cb(err)
    if (dirExists) return getStats(destStat, src, dest, opts, cb)
    mkdirs(destParent, err => {
      if (err) return cb(err)
      return getStats(destStat, src, dest, opts, cb)
    })
  })
}

function handleFilter (onInclude, destStat, src, dest, opts, cb) {
  Promise.resolve(opts.filter(src, dest)).then(include => {
    if (include) return onInclude(destStat, src, dest, opts, cb)
    return cb()
  }, error => cb(error))
}

function startCopy (destStat, src, dest, opts, cb) {
  if (opts.filter) return handleFilter(getStats, destStat, src, dest, opts, cb)
  return getStats(destStat, src, dest, opts, cb)
}

function getStats (destStat, src, dest, opts, cb) {
  const stat = opts.dereference ? fs.stat : fs.lstat
  stat(src, (err, srcStat) => {
    if (err) return cb(err)

    if (srcStat.isDirectory()) return onDir(srcStat, destStat, src, dest, opts, cb)
    else if (srcStat.isFile() ||
             srcStat.isCharacterDevice() ||
             srcStat.isBlockDevice()) return onFile(srcStat, destStat, src, dest, opts, cb)
    else if (srcStat.isSymbolicLink()) return onLink(destStat, src, dest, opts, cb)
    else if (srcStat.isSocket()) return cb(new Error(`Cannot copy a socket file: ${src}`))
    else if (srcStat.isFIFO()) return cb(new Error(`Cannot copy a FIFO pipe: ${src}`))
    return cb(new Error(`Unknown file: ${src}`))
  })
}

function onFile (srcStat, destStat, src, dest, opts, cb) {
  if (!destStat) return copyFile(srcStat, src, dest, opts, cb)
  return mayCopyFile(srcStat, src, dest, opts, cb)
}

function mayCopyFile (srcStat, src, dest, opts, cb) {
  if (opts.overwrite) {
    fs.unlink(dest, err => {
      if (err) return cb(err)
      return copyFile(srcStat, src, dest, opts, cb)
    })
  } else if (opts.errorOnExist) {
    return cb(new Error(`'${dest}' already exists`))
  } else return cb()
}

function copyFile (srcStat, src, dest, opts, cb) {
  fs.copyFile(src, dest, err => {
    if (err) return cb(err)
    if (opts.preserveTimestamps) return handleTimestampsAndMode(srcStat.mode, src, dest, cb)
    return setDestMode(dest, srcStat.mode, cb)
  })
}

function handleTimestampsAndMode (srcMode, src, dest, cb) {
  // Make sure the file is writable before setting the timestamp
  // otherwise open fails with EPERM when invoked with 'r+'
  // (through utimes call)
  if (fileIsNotWritable(srcMode)) {
    return makeFileWritable(dest, srcMode, err => {
      if (err) return cb(err)
      return setDestTimestampsAndMode(srcMode, src, dest, cb)
    })
  }
  return setDestTimestampsAndMode(srcMode, src, dest, cb)
}

function fileIsNotWritable (srcMode) {
  return (srcMode & 0o200) === 0
}

function makeFileWritable (dest, srcMode, cb) {
  return setDestMode(dest, srcMode | 0o200, cb)
}

function setDestTimestampsAndMode (srcMode, src, dest, cb) {
  setDestTimestamps(src, dest, err => {
    if (err) return cb(err)
    return setDestMode(dest, srcMode, cb)
  })
}

function setDestMode (dest, srcMode, cb) {
  return fs.chmod(dest, srcMode, cb)
}

function setDestTimestamps (src, dest, cb) {
  // The initial srcStat.atime cannot be trusted
  // because it is modified by the read(2) system call
  // (See https://nodejs.org/api/fs.html#fs_stat_time_values)
  fs.stat(src, (err, updatedSrcStat) => {
    if (err) return cb(err)
    return utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb)
  })
}

function onDir (srcStat, destStat, src, dest, opts, cb) {
  if (!destStat) return mkDirAndCopy(srcStat.mode, src, dest, opts, cb)
  return copyDir(src, dest, opts, cb)
}

function mkDirAndCopy (srcMode, src, dest, opts, cb) {
  fs.mkdir(dest, err => {
    if (err) return cb(err)
    copyDir(src, dest, opts, err => {
      if (err) return cb(err)
      return setDestMode(dest, srcMode, cb)
    })
  })
}

function copyDir (src, dest, opts, cb) {
  fs.readdir(src, (err, items) => {
    if (err) return cb(err)
    return copyDirItems(items, src, dest, opts, cb)
  })
}

function copyDirItems (items, src, dest, opts, cb) {
  const item = items.pop()
  if (!item) return cb()
  return copyDirItem(items, item, src, dest, opts, cb)
}

function copyDirItem (items, item, src, dest, opts, cb) {
  const srcItem = path.join(src, item)
  const destItem = path.join(dest, item)
  stat.checkPaths(srcItem, destItem, 'copy', opts, (err, stats) => {
    if (err) return cb(err)
    const { destStat } = stats
    startCopy(destStat, srcItem, destItem, opts, err => {
      if (err) return cb(err)
      return copyDirItems(items, src, dest, opts, cb)
    })
  })
}

function onLink (destStat, src, dest, opts, cb) {
  fs.readlink(src, (err, resolvedSrc) => {
    if (err) return cb(err)
    if (opts.dereference) {
      resolvedSrc = path.resolve(process.cwd(), resolvedSrc)
    }

    if (!destStat) {
      return fs.symlink(resolvedSrc, dest, cb)
    } else {
      fs.readlink(dest, (err, resolvedDest) => {
        if (err) {
          // dest exists and is a regular file or directory,
          // Windows may throw UNKNOWN error. If dest already exists,
          // fs throws error anyway, so no need to guard against it here.
          if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return fs.symlink(resolvedSrc, dest, cb)
          return cb(err)
        }
        if (opts.dereference) {
          resolvedDest = path.resolve(process.cwd(), resolvedDest)
        }
        if (stat.isSrcSubdir(resolvedSrc, resolvedDest)) {
          return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`))
        }

        // do not copy if src is a subdir of dest since unlinking
        // dest in this case would result in removing src contents
        // and therefore a broken symlink would be created.
        if (destStat.isDirectory() && stat.isSrcSubdir(resolvedDest, resolvedSrc)) {
          return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`))
        }
        return copyLink(resolvedSrc, dest, cb)
      })
    }
  })
}

function copyLink (resolvedSrc, dest, cb) {
  fs.unlink(dest, err => {
    if (err) return cb(err)
    return fs.symlink(resolvedSrc, dest, cb)
  })
}

module.exports = copy


/***/ }),

/***/ 6082:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const u = __nccwpck_require__(9973).fromCallback
module.exports = {
  copy: u(__nccwpck_require__(8400))
}


/***/ }),

/***/ 4264:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const u = __nccwpck_require__(9973).fromPromise
const fs = __nccwpck_require__(181)
const path = __nccwpck_require__(5622)
const mkdir = __nccwpck_require__(1470)
const remove = __nccwpck_require__(5951)

const emptyDir = u(async function emptyDir (dir) {
  let items
  try {
    items = await fs.readdir(dir)
  } catch {
    return mkdir.mkdirs(dir)
  }

  return Promise.all(items.map(item => remove.remove(path.join(dir, item))))
})

function emptyDirSync (dir) {
  let items
  try {
    items = fs.readdirSync(dir)
  } catch {
    return mkdir.mkdirsSync(dir)
  }

  items.forEach(item => {
    item = path.join(dir, item)
    remove.removeSync(item)
  })
}

module.exports = {
  emptyDirSync,
  emptydirSync: emptyDirSync,
  emptyDir,
  emptydir: emptyDir
}


/***/ }),

/***/ 6495:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const u = __nccwpck_require__(9973).fromCallback
const path = __nccwpck_require__(5622)
const fs = __nccwpck_require__(7905)
const mkdir = __nccwpck_require__(1470)

function createFile (file, callback) {
  function makeFile () {
    fs.writeFile(file, '', err => {
      if (err) return callback(err)
      callback()
    })
  }

  fs.stat(file, (err, stats) => { // eslint-disable-line handle-callback-err
    if (!err && stats.isFile()) return callback()
    const dir = path.dirname(file)
    fs.stat(dir, (err, stats) => {
      if (err) {
        // if the directory doesn't exist, make it
        if (err.code === 'ENOENT') {
          return mkdir.mkdirs(dir, err => {
            if (err) return callback(err)
            makeFile()
          })
        }
        return callback(err)
      }

      if (stats.isDirectory()) makeFile()
      else {
        // parent is not a directory
        // This is just to cause an internal ENOTDIR error to be thrown
        fs.readdir(dir, err => {
          if (err) return callback(err)
        })
      }
    })
  })
}

function createFileSync (file) {
  let stats
  try {
    stats = fs.statSync(file)
  } catch {}
  if (stats && stats.isFile()) return

  const dir = path.dirname(file)
  try {
    if (!fs.statSync(dir).isDirectory()) {
      // parent is not a directory
      // This is just to cause an internal ENOTDIR error to be thrown
      fs.readdirSync(dir)
    }
  } catch (err) {
    // If the stat call above failed because the directory doesn't exist, create it
    if (err && err.code === 'ENOENT') mkdir.mkdirsSync(dir)
    else throw err
  }

  fs.writeFileSync(file, '')
}

module.exports = {
  createFile: u(createFile),
  createFileSync
}


/***/ }),

/***/ 3483:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const file = __nccwpck_require__(6495)
const link = __nccwpck_require__(4802)
const symlink = __nccwpck_require__(639)

module.exports = {
  // file
  createFile: file.createFile,
  createFileSync: file.createFileSync,
  ensureFile: file.createFile,
  ensureFileSync: file.createFileSync,
  // link
  createLink: link.createLink,
  createLinkSync: link.createLinkSync,
  ensureLink: link.createLink,
  ensureLinkSync: link.createLinkSync,
  // symlink
  createSymlink: symlink.createSymlink,
  createSymlinkSync: symlink.createSymlinkSync,
  ensureSymlink: symlink.createSymlink,
  ensureSymlinkSync: symlink.createSymlinkSync
}


/***/ }),

/***/ 4802:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const u = __nccwpck_require__(9973).fromCallback
const path = __nccwpck_require__(5622)
const fs = __nccwpck_require__(7905)
const mkdir = __nccwpck_require__(1470)
const pathExists = __nccwpck_require__(1382).pathExists
const { areIdentical } = __nccwpck_require__(7526)

function createLink (srcpath, dstpath, callback) {
  function makeLink (srcpath, dstpath) {
    fs.link(srcpath, dstpath, err => {
      if (err) return callback(err)
      callback(null)
    })
  }

  fs.lstat(dstpath, (_, dstStat) => {
    fs.lstat(srcpath, (err, srcStat) => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureLink')
        return callback(err)
      }
      if (dstStat && areIdentical(srcStat, dstStat)) return callback(null)

      const dir = path.dirname(dstpath)
      pathExists(dir, (err, dirExists) => {
        if (err) return callback(err)
        if (dirExists) return makeLink(srcpath, dstpath)
        mkdir.mkdirs(dir, err => {
          if (err) return callback(err)
          makeLink(srcpath, dstpath)
        })
      })
    })
  })
}

function createLinkSync (srcpath, dstpath) {
  let dstStat
  try {
    dstStat = fs.lstatSync(dstpath)
  } catch {}

  try {
    const srcStat = fs.lstatSync(srcpath)
    if (dstStat && areIdentical(srcStat, dstStat)) return
  } catch (err) {
    err.message = err.message.replace('lstat', 'ensureLink')
    throw err
  }

  const dir = path.dirname(dstpath)
  const dirExists = fs.existsSync(dir)
  if (dirExists) return fs.linkSync(srcpath, dstpath)
  mkdir.mkdirsSync(dir)

  return fs.linkSync(srcpath, dstpath)
}

module.exports = {
  createLink: u(createLink),
  createLinkSync
}


/***/ }),

/***/ 8118:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(5622)
const fs = __nccwpck_require__(7905)
const pathExists = __nccwpck_require__(1382).pathExists

/**
 * Function that returns two types of paths, one relative to symlink, and one
 * relative to the current working directory. Checks if path is absolute or
 * relative. If the path is relative, this function checks if the path is
 * relative to symlink or relative to current working directory. This is an
 * initiative to find a smarter `srcpath` to supply when building symlinks.
 * This allows you to determine which path to use out of one of three possible
 * types of source paths. The first is an absolute path. This is detected by
 * `path.isAbsolute()`. When an absolute path is provided, it is checked to
 * see if it exists. If it does it's used, if not an error is returned
 * (callback)/ thrown (sync). The other two options for `srcpath` are a
 * relative url. By default Node's `fs.symlink` works by creating a symlink
 * using `dstpath` and expects the `srcpath` to be relative to the newly
 * created symlink. If you provide a `srcpath` that does not exist on the file
 * system it results in a broken symlink. To minimize this, the function
 * checks to see if the 'relative to symlink' source file exists, and if it
 * does it will use it. If it does not, it checks if there's a file that
 * exists that is relative to the current working directory, if does its used.
 * This preserves the expectations of the original fs.symlink spec and adds
 * the ability to pass in `relative to current working direcotry` paths.
 */

function symlinkPaths (srcpath, dstpath, callback) {
  if (path.isAbsolute(srcpath)) {
    return fs.lstat(srcpath, (err) => {
      if (err) {
        err.message = err.message.replace('lstat', 'ensureSymlink')
        return callback(err)
      }
      return callback(null, {
        toCwd: srcpath,
        toDst: srcpath
      })
    })
  } else {
    const dstdir = path.dirname(dstpath)
    const relativeToDst = path.join(dstdir, srcpath)
    return pathExists(relativeToDst, (err, exists) => {
      if (err) return callback(err)
      if (exists) {
        return callback(null, {
          toCwd: relativeToDst,
          toDst: srcpath
        })
      } else {
        return fs.lstat(srcpath, (err) => {
          if (err) {
            err.message = err.message.replace('lstat', 'ensureSymlink')
            return callback(err)
          }
          return callback(null, {
            toCwd: srcpath,
            toDst: path.relative(dstdir, srcpath)
          })
        })
      }
    })
  }
}

function symlinkPathsSync (srcpath, dstpath) {
  let exists
  if (path.isAbsolute(srcpath)) {
    exists = fs.existsSync(srcpath)
    if (!exists) throw new Error('absolute srcpath does not exist')
    return {
      toCwd: srcpath,
      toDst: srcpath
    }
  } else {
    const dstdir = path.dirname(dstpath)
    const relativeToDst = path.join(dstdir, srcpath)
    exists = fs.existsSync(relativeToDst)
    if (exists) {
      return {
        toCwd: relativeToDst,
        toDst: srcpath
      }
    } else {
      exists = fs.existsSync(srcpath)
      if (!exists) throw new Error('relative srcpath does not exist')
      return {
        toCwd: srcpath,
        toDst: path.relative(dstdir, srcpath)
      }
    }
  }
}

module.exports = {
  symlinkPaths,
  symlinkPathsSync
}


/***/ }),

/***/ 5742:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(7905)

function symlinkType (srcpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback
  type = (typeof type === 'function') ? false : type
  if (type) return callback(null, type)
  fs.lstat(srcpath, (err, stats) => {
    if (err) return callback(null, 'file')
    type = (stats && stats.isDirectory()) ? 'dir' : 'file'
    callback(null, type)
  })
}

function symlinkTypeSync (srcpath, type) {
  let stats

  if (type) return type
  try {
    stats = fs.lstatSync(srcpath)
  } catch {
    return 'file'
  }
  return (stats && stats.isDirectory()) ? 'dir' : 'file'
}

module.exports = {
  symlinkType,
  symlinkTypeSync
}


/***/ }),

/***/ 639:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const u = __nccwpck_require__(9973).fromCallback
const path = __nccwpck_require__(5622)
const fs = __nccwpck_require__(181)
const _mkdirs = __nccwpck_require__(1470)
const mkdirs = _mkdirs.mkdirs
const mkdirsSync = _mkdirs.mkdirsSync

const _symlinkPaths = __nccwpck_require__(8118)
const symlinkPaths = _symlinkPaths.symlinkPaths
const symlinkPathsSync = _symlinkPaths.symlinkPathsSync

const _symlinkType = __nccwpck_require__(5742)
const symlinkType = _symlinkType.symlinkType
const symlinkTypeSync = _symlinkType.symlinkTypeSync

const pathExists = __nccwpck_require__(1382).pathExists

const { areIdentical } = __nccwpck_require__(7526)

function createSymlink (srcpath, dstpath, type, callback) {
  callback = (typeof type === 'function') ? type : callback
  type = (typeof type === 'function') ? false : type

  fs.lstat(dstpath, (err, stats) => {
    if (!err && stats.isSymbolicLink()) {
      Promise.all([
        fs.stat(srcpath),
        fs.stat(dstpath)
      ]).then(([srcStat, dstStat]) => {
        if (areIdentical(srcStat, dstStat)) return callback(null)
        _createSymlink(srcpath, dstpath, type, callback)
      })
    } else _createSymlink(srcpath, dstpath, type, callback)
  })
}

function _createSymlink (srcpath, dstpath, type, callback) {
  symlinkPaths(srcpath, dstpath, (err, relative) => {
    if (err) return callback(err)
    srcpath = relative.toDst
    symlinkType(relative.toCwd, type, (err, type) => {
      if (err) return callback(err)
      const dir = path.dirname(dstpath)
      pathExists(dir, (err, dirExists) => {
        if (err) return callback(err)
        if (dirExists) return fs.symlink(srcpath, dstpath, type, callback)
        mkdirs(dir, err => {
          if (err) return callback(err)
          fs.symlink(srcpath, dstpath, type, callback)
        })
      })
    })
  })
}

function createSymlinkSync (srcpath, dstpath, type) {
  let stats
  try {
    stats = fs.lstatSync(dstpath)
  } catch {}
  if (stats && stats.isSymbolicLink()) {
    const srcStat = fs.statSync(srcpath)
    const dstStat = fs.statSync(dstpath)
    if (areIdentical(srcStat, dstStat)) return
  }

  const relative = symlinkPathsSync(srcpath, dstpath)
  srcpath = relative.toDst
  type = symlinkTypeSync(relative.toCwd, type)
  const dir = path.dirname(dstpath)
  const exists = fs.existsSync(dir)
  if (exists) return fs.symlinkSync(srcpath, dstpath, type)
  mkdirsSync(dir)
  return fs.symlinkSync(srcpath, dstpath, type)
}

module.exports = {
  createSymlink: u(createSymlink),
  createSymlinkSync
}


/***/ }),

/***/ 181:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

// This is adapted from https://github.com/normalize/mz
// Copyright (c) 2014-2016 Jonathan Ong me@jongleberry.com and Contributors
const u = __nccwpck_require__(9973).fromCallback
const fs = __nccwpck_require__(7905)

const api = [
  'access',
  'appendFile',
  'chmod',
  'chown',
  'close',
  'copyFile',
  'fchmod',
  'fchown',
  'fdatasync',
  'fstat',
  'fsync',
  'ftruncate',
  'futimes',
  'lchmod',
  'lchown',
  'link',
  'lstat',
  'mkdir',
  'mkdtemp',
  'open',
  'opendir',
  'readdir',
  'readFile',
  'readlink',
  'realpath',
  'rename',
  'rm',
  'rmdir',
  'stat',
  'symlink',
  'truncate',
  'unlink',
  'utimes',
  'writeFile'
].filter(key => {
  // Some commands are not available on some systems. Ex:
  // fs.opendir was added in Node.js v12.12.0
  // fs.rm was added in Node.js v14.14.0
  // fs.lchown is not available on at least some Linux
  return typeof fs[key] === 'function'
})

// Export cloned fs:
Object.assign(exports, fs)

// Universalify async methods:
api.forEach(method => {
  exports[method] = u(fs[method])
})
exports.realpath.native = u(fs.realpath.native)

// We differ from mz/fs in that we still ship the old, broken, fs.exists()
// since we are a drop-in replacement for the native module
exports.exists = function (filename, callback) {
  if (typeof callback === 'function') {
    return fs.exists(filename, callback)
  }
  return new Promise(resolve => {
    return fs.exists(filename, resolve)
  })
}

// fs.read(), fs.write(), & fs.writev() need special treatment due to multiple callback args

exports.read = function (fd, buffer, offset, length, position, callback) {
  if (typeof callback === 'function') {
    return fs.read(fd, buffer, offset, length, position, callback)
  }
  return new Promise((resolve, reject) => {
    fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
      if (err) return reject(err)
      resolve({ bytesRead, buffer })
    })
  })
}

// Function signature can be
// fs.write(fd, buffer[, offset[, length[, position]]], callback)
// OR
// fs.write(fd, string[, position[, encoding]], callback)
// We need to handle both cases, so we use ...args
exports.write = function (fd, buffer, ...args) {
  if (typeof args[args.length - 1] === 'function') {
    return fs.write(fd, buffer, ...args)
  }

  return new Promise((resolve, reject) => {
    fs.write(fd, buffer, ...args, (err, bytesWritten, buffer) => {
      if (err) return reject(err)
      resolve({ bytesWritten, buffer })
    })
  })
}

// fs.writev only available in Node v12.9.0+
if (typeof fs.writev === 'function') {
  // Function signature is
  // s.writev(fd, buffers[, position], callback)
  // We need to handle the optional arg, so we use ...args
  exports.writev = function (fd, buffers, ...args) {
    if (typeof args[args.length - 1] === 'function') {
      return fs.writev(fd, buffers, ...args)
    }

    return new Promise((resolve, reject) => {
      fs.writev(fd, buffers, ...args, (err, bytesWritten, buffers) => {
        if (err) return reject(err)
        resolve({ bytesWritten, buffers })
      })
    })
  }
}


/***/ }),

/***/ 5501:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = {
  // Export promiseified graceful-fs:
  ...__nccwpck_require__(181),
  // Export extra methods:
  ...__nccwpck_require__(582),
  ...__nccwpck_require__(6082),
  ...__nccwpck_require__(4264),
  ...__nccwpck_require__(3483),
  ...__nccwpck_require__(6797),
  ...__nccwpck_require__(1470),
  ...__nccwpck_require__(2599),
  ...__nccwpck_require__(6271),
  ...__nccwpck_require__(6981),
  ...__nccwpck_require__(1382),
  ...__nccwpck_require__(5951)
}


/***/ }),

/***/ 6797:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const u = __nccwpck_require__(9973).fromPromise
const jsonFile = __nccwpck_require__(6098)

jsonFile.outputJson = u(__nccwpck_require__(6961))
jsonFile.outputJsonSync = __nccwpck_require__(8300)
// aliases
jsonFile.outputJSON = jsonFile.outputJson
jsonFile.outputJSONSync = jsonFile.outputJsonSync
jsonFile.writeJSON = jsonFile.writeJson
jsonFile.writeJSONSync = jsonFile.writeJsonSync
jsonFile.readJSON = jsonFile.readJson
jsonFile.readJSONSync = jsonFile.readJsonSync

module.exports = jsonFile


/***/ }),

/***/ 6098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const jsonFile = __nccwpck_require__(9293)

module.exports = {
  // jsonfile exports
  readJson: jsonFile.readFile,
  readJsonSync: jsonFile.readFileSync,
  writeJson: jsonFile.writeFile,
  writeJsonSync: jsonFile.writeFileSync
}


/***/ }),

/***/ 8300:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { stringify } = __nccwpck_require__(3555)
const { outputFileSync } = __nccwpck_require__(6981)

function outputJsonSync (file, data, options) {
  const str = stringify(data, options)

  outputFileSync(file, str, options)
}

module.exports = outputJsonSync


/***/ }),

/***/ 6961:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { stringify } = __nccwpck_require__(3555)
const { outputFile } = __nccwpck_require__(6981)

async function outputJson (file, data, options = {}) {
  const str = stringify(data, options)

  await outputFile(file, str, options)
}

module.exports = outputJson


/***/ }),

/***/ 1470:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const u = __nccwpck_require__(9973).fromPromise
const { makeDir: _makeDir, makeDirSync } = __nccwpck_require__(6620)
const makeDir = u(_makeDir)

module.exports = {
  mkdirs: makeDir,
  mkdirsSync: makeDirSync,
  // alias
  mkdirp: makeDir,
  mkdirpSync: makeDirSync,
  ensureDir: makeDir,
  ensureDirSync: makeDirSync
}


/***/ }),

/***/ 6620:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const fs = __nccwpck_require__(181)
const { checkPath } = __nccwpck_require__(9361)

const getMode = options => {
  const defaults = { mode: 0o777 }
  if (typeof options === 'number') return options
  return ({ ...defaults, ...options }).mode
}

module.exports.makeDir = async (dir, options) => {
  checkPath(dir)

  return fs.mkdir(dir, {
    mode: getMode(options),
    recursive: true
  })
}

module.exports.makeDirSync = (dir, options) => {
  checkPath(dir)

  return fs.mkdirSync(dir, {
    mode: getMode(options),
    recursive: true
  })
}


/***/ }),

/***/ 9361:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
// Adapted from https://github.com/sindresorhus/make-dir
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const path = __nccwpck_require__(5622)

// https://github.com/nodejs/node/issues/8987
// https://github.com/libuv/libuv/pull/1088
module.exports.checkPath = function checkPath (pth) {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace(path.parse(pth).root, ''))

    if (pathHasInvalidWinCharacters) {
      const error = new Error(`Path contains invalid characters: ${pth}`)
      error.code = 'EINVAL'
      throw error
    }
  }
}


/***/ }),

/***/ 2599:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = {
  moveSync: __nccwpck_require__(6751)
}


/***/ }),

/***/ 6751:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(7905)
const path = __nccwpck_require__(5622)
const copySync = __nccwpck_require__(582).copySync
const removeSync = __nccwpck_require__(5951).removeSync
const mkdirpSync = __nccwpck_require__(1470).mkdirpSync
const stat = __nccwpck_require__(7526)

function moveSync (src, dest, opts) {
  opts = opts || {}
  const overwrite = opts.overwrite || opts.clobber || false

  const { srcStat, isChangingCase = false } = stat.checkPathsSync(src, dest, 'move', opts)
  stat.checkParentPathsSync(src, srcStat, dest, 'move')
  if (!isParentRoot(dest)) mkdirpSync(path.dirname(dest))
  return doRename(src, dest, overwrite, isChangingCase)
}

function isParentRoot (dest) {
  const parent = path.dirname(dest)
  const parsedPath = path.parse(parent)
  return parsedPath.root === parent
}

function doRename (src, dest, overwrite, isChangingCase) {
  if (isChangingCase) return rename(src, dest, overwrite)
  if (overwrite) {
    removeSync(dest)
    return rename(src, dest, overwrite)
  }
  if (fs.existsSync(dest)) throw new Error('dest already exists.')
  return rename(src, dest, overwrite)
}

function rename (src, dest, overwrite) {
  try {
    fs.renameSync(src, dest)
  } catch (err) {
    if (err.code !== 'EXDEV') throw err
    return moveAcrossDevice(src, dest, overwrite)
  }
}

function moveAcrossDevice (src, dest, overwrite) {
  const opts = {
    overwrite,
    errorOnExist: true
  }
  copySync(src, dest, opts)
  return removeSync(src)
}

module.exports = moveSync


/***/ }),

/***/ 6271:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const u = __nccwpck_require__(9973).fromCallback
module.exports = {
  move: u(__nccwpck_require__(1566))
}


/***/ }),

/***/ 1566:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(7905)
const path = __nccwpck_require__(5622)
const copy = __nccwpck_require__(6082).copy
const remove = __nccwpck_require__(5951).remove
const mkdirp = __nccwpck_require__(1470).mkdirp
const pathExists = __nccwpck_require__(1382).pathExists
const stat = __nccwpck_require__(7526)

function move (src, dest, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }

  const overwrite = opts.overwrite || opts.clobber || false

  stat.checkPaths(src, dest, 'move', opts, (err, stats) => {
    if (err) return cb(err)
    const { srcStat, isChangingCase = false } = stats
    stat.checkParentPaths(src, srcStat, dest, 'move', err => {
      if (err) return cb(err)
      if (isParentRoot(dest)) return doRename(src, dest, overwrite, isChangingCase, cb)
      mkdirp(path.dirname(dest), err => {
        if (err) return cb(err)
        return doRename(src, dest, overwrite, isChangingCase, cb)
      })
    })
  })
}

function isParentRoot (dest) {
  const parent = path.dirname(dest)
  const parsedPath = path.parse(parent)
  return parsedPath.root === parent
}

function doRename (src, dest, overwrite, isChangingCase, cb) {
  if (isChangingCase) return rename(src, dest, overwrite, cb)
  if (overwrite) {
    return remove(dest, err => {
      if (err) return cb(err)
      return rename(src, dest, overwrite, cb)
    })
  }
  pathExists(dest, (err, destExists) => {
    if (err) return cb(err)
    if (destExists) return cb(new Error('dest already exists.'))
    return rename(src, dest, overwrite, cb)
  })
}

function rename (src, dest, overwrite, cb) {
  fs.rename(src, dest, err => {
    if (!err) return cb()
    if (err.code !== 'EXDEV') return cb(err)
    return moveAcrossDevice(src, dest, overwrite, cb)
  })
}

function moveAcrossDevice (src, dest, overwrite, cb) {
  const opts = {
    overwrite,
    errorOnExist: true
  }
  copy(src, dest, opts, err => {
    if (err) return cb(err)
    return remove(src, cb)
  })
}

module.exports = move


/***/ }),

/***/ 6981:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const u = __nccwpck_require__(9973).fromCallback
const fs = __nccwpck_require__(7905)
const path = __nccwpck_require__(5622)
const mkdir = __nccwpck_require__(1470)
const pathExists = __nccwpck_require__(1382).pathExists

function outputFile (file, data, encoding, callback) {
  if (typeof encoding === 'function') {
    callback = encoding
    encoding = 'utf8'
  }

  const dir = path.dirname(file)
  pathExists(dir, (err, itDoes) => {
    if (err) return callback(err)
    if (itDoes) return fs.writeFile(file, data, encoding, callback)

    mkdir.mkdirs(dir, err => {
      if (err) return callback(err)

      fs.writeFile(file, data, encoding, callback)
    })
  })
}

function outputFileSync (file, ...args) {
  const dir = path.dirname(file)
  if (fs.existsSync(dir)) {
    return fs.writeFileSync(file, ...args)
  }
  mkdir.mkdirsSync(dir)
  fs.writeFileSync(file, ...args)
}

module.exports = {
  outputFile: u(outputFile),
  outputFileSync
}


/***/ }),

/***/ 1382:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const u = __nccwpck_require__(9973).fromPromise
const fs = __nccwpck_require__(181)

function pathExists (path) {
  return fs.access(path).then(() => true).catch(() => false)
}

module.exports = {
  pathExists: u(pathExists),
  pathExistsSync: fs.existsSync
}


/***/ }),

/***/ 5951:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(7905)
const u = __nccwpck_require__(9973).fromCallback
const rimraf = __nccwpck_require__(1170)

function remove (path, callback) {
  // Node 14.14.0+
  if (fs.rm) return fs.rm(path, { recursive: true, force: true }, callback)
  rimraf(path, callback)
}

function removeSync (path) {
  // Node 14.14.0+
  if (fs.rmSync) return fs.rmSync(path, { recursive: true, force: true })
  rimraf.sync(path)
}

module.exports = {
  remove: u(remove),
  removeSync
}


/***/ }),

/***/ 1170:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(7905)
const path = __nccwpck_require__(5622)
const assert = __nccwpck_require__(2357)

const isWindows = (process.platform === 'win32')

function defaults (options) {
  const methods = [
    'unlink',
    'chmod',
    'stat',
    'lstat',
    'rmdir',
    'readdir'
  ]
  methods.forEach(m => {
    options[m] = options[m] || fs[m]
    m = m + 'Sync'
    options[m] = options[m] || fs[m]
  })

  options.maxBusyTries = options.maxBusyTries || 3
}

function rimraf (p, options, cb) {
  let busyTries = 0

  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  assert(p, 'rimraf: missing path')
  assert.strictEqual(typeof p, 'string', 'rimraf: path should be a string')
  assert.strictEqual(typeof cb, 'function', 'rimraf: callback function required')
  assert(options, 'rimraf: invalid options argument provided')
  assert.strictEqual(typeof options, 'object', 'rimraf: options should be object')

  defaults(options)

  rimraf_(p, options, function CB (er) {
    if (er) {
      if ((er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') &&
          busyTries < options.maxBusyTries) {
        busyTries++
        const time = busyTries * 100
        // try again, with the same exact callback as this one.
        return setTimeout(() => rimraf_(p, options, CB), time)
      }

      // already gone
      if (er.code === 'ENOENT') er = null
    }

    cb(er)
  })
}

// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function rimraf_ (p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  // sunos lets the root user unlink directories, which is... weird.
  // so we have to lstat here and make sure it's not a dir.
  options.lstat(p, (er, st) => {
    if (er && er.code === 'ENOENT') {
      return cb(null)
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er && er.code === 'EPERM' && isWindows) {
      return fixWinEPERM(p, options, er, cb)
    }

    if (st && st.isDirectory()) {
      return rmdir(p, options, er, cb)
    }

    options.unlink(p, er => {
      if (er) {
        if (er.code === 'ENOENT') {
          return cb(null)
        }
        if (er.code === 'EPERM') {
          return (isWindows)
            ? fixWinEPERM(p, options, er, cb)
            : rmdir(p, options, er, cb)
        }
        if (er.code === 'EISDIR') {
          return rmdir(p, options, er, cb)
        }
      }
      return cb(er)
    })
  })
}

function fixWinEPERM (p, options, er, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.chmod(p, 0o666, er2 => {
    if (er2) {
      cb(er2.code === 'ENOENT' ? null : er)
    } else {
      options.stat(p, (er3, stats) => {
        if (er3) {
          cb(er3.code === 'ENOENT' ? null : er)
        } else if (stats.isDirectory()) {
          rmdir(p, options, er, cb)
        } else {
          options.unlink(p, cb)
        }
      })
    }
  })
}

function fixWinEPERMSync (p, options, er) {
  let stats

  assert(p)
  assert(options)

  try {
    options.chmodSync(p, 0o666)
  } catch (er2) {
    if (er2.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  try {
    stats = options.statSync(p)
  } catch (er3) {
    if (er3.code === 'ENOENT') {
      return
    } else {
      throw er
    }
  }

  if (stats.isDirectory()) {
    rmdirSync(p, options, er)
  } else {
    options.unlinkSync(p)
  }
}

function rmdir (p, options, originalEr, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
  // if we guessed wrong, and it's not a directory, then
  // raise the original error.
  options.rmdir(p, er => {
    if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) {
      rmkids(p, options, cb)
    } else if (er && er.code === 'ENOTDIR') {
      cb(originalEr)
    } else {
      cb(er)
    }
  })
}

function rmkids (p, options, cb) {
  assert(p)
  assert(options)
  assert(typeof cb === 'function')

  options.readdir(p, (er, files) => {
    if (er) return cb(er)

    let n = files.length
    let errState

    if (n === 0) return options.rmdir(p, cb)

    files.forEach(f => {
      rimraf(path.join(p, f), options, er => {
        if (errState) {
          return
        }
        if (er) return cb(errState = er)
        if (--n === 0) {
          options.rmdir(p, cb)
        }
      })
    })
  })
}

// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function rimrafSync (p, options) {
  let st

  options = options || {}
  defaults(options)

  assert(p, 'rimraf: missing path')
  assert.strictEqual(typeof p, 'string', 'rimraf: path should be a string')
  assert(options, 'rimraf: missing options')
  assert.strictEqual(typeof options, 'object', 'rimraf: options should be object')

  try {
    st = options.lstatSync(p)
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    }

    // Windows can EPERM on stat.  Life is suffering.
    if (er.code === 'EPERM' && isWindows) {
      fixWinEPERMSync(p, options, er)
    }
  }

  try {
    // sunos lets the root user unlink directories, which is... weird.
    if (st && st.isDirectory()) {
      rmdirSync(p, options, null)
    } else {
      options.unlinkSync(p)
    }
  } catch (er) {
    if (er.code === 'ENOENT') {
      return
    } else if (er.code === 'EPERM') {
      return isWindows ? fixWinEPERMSync(p, options, er) : rmdirSync(p, options, er)
    } else if (er.code !== 'EISDIR') {
      throw er
    }
    rmdirSync(p, options, er)
  }
}

function rmdirSync (p, options, originalEr) {
  assert(p)
  assert(options)

  try {
    options.rmdirSync(p)
  } catch (er) {
    if (er.code === 'ENOTDIR') {
      throw originalEr
    } else if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') {
      rmkidsSync(p, options)
    } else if (er.code !== 'ENOENT') {
      throw er
    }
  }
}

function rmkidsSync (p, options) {
  assert(p)
  assert(options)
  options.readdirSync(p).forEach(f => rimrafSync(path.join(p, f), options))

  if (isWindows) {
    // We only end up here once we got ENOTEMPTY at least once, and
    // at this point, we are guaranteed to have removed all the kids.
    // So, we know that it won't be ENOENT or ENOTDIR or anything else.
    // try really hard to delete stuff on windows, because it has a
    // PROFOUNDLY annoying habit of not closing handles promptly when
    // files are deleted, resulting in spurious ENOTEMPTY errors.
    const startTime = Date.now()
    do {
      try {
        const ret = options.rmdirSync(p, options)
        return ret
      } catch {}
    } while (Date.now() - startTime < 500) // give up after 500ms
  } else {
    const ret = options.rmdirSync(p, options)
    return ret
  }
}

module.exports = rimraf
rimraf.sync = rimrafSync


/***/ }),

/***/ 7526:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(181)
const path = __nccwpck_require__(5622)
const util = __nccwpck_require__(1669)

function getStats (src, dest, opts) {
  const statFunc = opts.dereference
    ? (file) => fs.stat(file, { bigint: true })
    : (file) => fs.lstat(file, { bigint: true })
  return Promise.all([
    statFunc(src),
    statFunc(dest).catch(err => {
      if (err.code === 'ENOENT') return null
      throw err
    })
  ]).then(([srcStat, destStat]) => ({ srcStat, destStat }))
}

function getStatsSync (src, dest, opts) {
  let destStat
  const statFunc = opts.dereference
    ? (file) => fs.statSync(file, { bigint: true })
    : (file) => fs.lstatSync(file, { bigint: true })
  const srcStat = statFunc(src)
  try {
    destStat = statFunc(dest)
  } catch (err) {
    if (err.code === 'ENOENT') return { srcStat, destStat: null }
    throw err
  }
  return { srcStat, destStat }
}

function checkPaths (src, dest, funcName, opts, cb) {
  util.callbackify(getStats)(src, dest, opts, (err, stats) => {
    if (err) return cb(err)
    const { srcStat, destStat } = stats

    if (destStat) {
      if (areIdentical(srcStat, destStat)) {
        const srcBaseName = path.basename(src)
        const destBaseName = path.basename(dest)
        if (funcName === 'move' &&
          srcBaseName !== destBaseName &&
          srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
          return cb(null, { srcStat, destStat, isChangingCase: true })
        }
        return cb(new Error('Source and destination must not be the same.'))
      }
      if (srcStat.isDirectory() && !destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`))
      }
      if (!srcStat.isDirectory() && destStat.isDirectory()) {
        return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`))
      }
    }

    if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
      return cb(new Error(errMsg(src, dest, funcName)))
    }
    return cb(null, { srcStat, destStat })
  })
}

function checkPathsSync (src, dest, funcName, opts) {
  const { srcStat, destStat } = getStatsSync(src, dest, opts)

  if (destStat) {
    if (areIdentical(srcStat, destStat)) {
      const srcBaseName = path.basename(src)
      const destBaseName = path.basename(dest)
      if (funcName === 'move' &&
        srcBaseName !== destBaseName &&
        srcBaseName.toLowerCase() === destBaseName.toLowerCase()) {
        return { srcStat, destStat, isChangingCase: true }
      }
      throw new Error('Source and destination must not be the same.')
    }
    if (srcStat.isDirectory() && !destStat.isDirectory()) {
      throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`)
    }
    if (!srcStat.isDirectory() && destStat.isDirectory()) {
      throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`)
    }
  }

  if (srcStat.isDirectory() && isSrcSubdir(src, dest)) {
    throw new Error(errMsg(src, dest, funcName))
  }
  return { srcStat, destStat }
}

// recursively check if dest parent is a subdirectory of src.
// It works for all file types including symlinks since it
// checks the src and dest inodes. It starts from the deepest
// parent and stops once it reaches the src parent or the root path.
function checkParentPaths (src, srcStat, dest, funcName, cb) {
  const srcParent = path.resolve(path.dirname(src))
  const destParent = path.resolve(path.dirname(dest))
  if (destParent === srcParent || destParent === path.parse(destParent).root) return cb()
  fs.stat(destParent, { bigint: true }, (err, destStat) => {
    if (err) {
      if (err.code === 'ENOENT') return cb()
      return cb(err)
    }
    if (areIdentical(srcStat, destStat)) {
      return cb(new Error(errMsg(src, dest, funcName)))
    }
    return checkParentPaths(src, srcStat, destParent, funcName, cb)
  })
}

function checkParentPathsSync (src, srcStat, dest, funcName) {
  const srcParent = path.resolve(path.dirname(src))
  const destParent = path.resolve(path.dirname(dest))
  if (destParent === srcParent || destParent === path.parse(destParent).root) return
  let destStat
  try {
    destStat = fs.statSync(destParent, { bigint: true })
  } catch (err) {
    if (err.code === 'ENOENT') return
    throw err
  }
  if (areIdentical(srcStat, destStat)) {
    throw new Error(errMsg(src, dest, funcName))
  }
  return checkParentPathsSync(src, srcStat, destParent, funcName)
}

function areIdentical (srcStat, destStat) {
  return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev
}

// return true if dest is a subdir of src, otherwise false.
// It only checks the path strings.
function isSrcSubdir (src, dest) {
  const srcArr = path.resolve(src).split(path.sep).filter(i => i)
  const destArr = path.resolve(dest).split(path.sep).filter(i => i)
  return srcArr.reduce((acc, cur, i) => acc && destArr[i] === cur, true)
}

function errMsg (src, dest, funcName) {
  return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`
}

module.exports = {
  checkPaths,
  checkPathsSync,
  checkParentPaths,
  checkParentPathsSync,
  isSrcSubdir,
  areIdentical
}


/***/ }),

/***/ 1767:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(7905)

function utimesMillis (path, atime, mtime, callback) {
  // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)
  fs.open(path, 'r+', (err, fd) => {
    if (err) return callback(err)
    fs.futimes(fd, atime, mtime, futimesErr => {
      fs.close(fd, closeErr => {
        if (callback) callback(futimesErr || closeErr)
      })
    })
  })
}

function utimesMillisSync (path, atime, mtime) {
  const fd = fs.openSync(path, 'r+')
  fs.futimesSync(fd, atime, mtime)
  return fs.closeSync(fd)
}

module.exports = {
  utimesMillis,
  utimesMillisSync
}


/***/ }),

/***/ 9735:
/***/ ((module) => {

"use strict";


module.exports = clone

var getPrototypeOf = Object.getPrototypeOf || function (obj) {
  return obj.__proto__
}

function clone (obj) {
  if (obj === null || typeof obj !== 'object')
    return obj

  if (obj instanceof Object)
    var copy = { __proto__: getPrototypeOf(obj) }
  else
    var copy = Object.create(null)

  Object.getOwnPropertyNames(obj).forEach(function (key) {
    Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key))
  })

  return copy
}


/***/ }),

/***/ 7905:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(5747)
var polyfills = __nccwpck_require__(670)
var legacy = __nccwpck_require__(8612)
var clone = __nccwpck_require__(9735)

var util = __nccwpck_require__(1669)

/* istanbul ignore next - node 0.x polyfill */
var gracefulQueue
var previousSymbol

/* istanbul ignore else - node 0.x polyfill */
if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
  gracefulQueue = Symbol.for('graceful-fs.queue')
  // This is used in testing by future versions
  previousSymbol = Symbol.for('graceful-fs.previous')
} else {
  gracefulQueue = '___graceful-fs.queue'
  previousSymbol = '___graceful-fs.previous'
}

function noop () {}

function publishQueue(context, queue) {
  Object.defineProperty(context, gracefulQueue, {
    get: function() {
      return queue
    }
  })
}

var debug = noop
if (util.debuglog)
  debug = util.debuglog('gfs4')
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ''))
  debug = function() {
    var m = util.format.apply(util, arguments)
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ')
    console.error(m)
  }

// Once time initialization
if (!fs[gracefulQueue]) {
  // This queue can be shared by multiple loaded instances
  var queue = global[gracefulQueue] || []
  publishQueue(fs, queue)

  // Patch fs.close/closeSync to shared queue version, because we need
  // to retry() whenever a close happens *anywhere* in the program.
  // This is essential when multiple graceful-fs instances are
  // in play at the same time.
  fs.close = (function (fs$close) {
    function close (fd, cb) {
      return fs$close.call(fs, fd, function (err) {
        // This function uses the graceful-fs shared queue
        if (!err) {
          retry()
        }

        if (typeof cb === 'function')
          cb.apply(this, arguments)
      })
    }

    Object.defineProperty(close, previousSymbol, {
      value: fs$close
    })
    return close
  })(fs.close)

  fs.closeSync = (function (fs$closeSync) {
    function closeSync (fd) {
      // This function uses the graceful-fs shared queue
      fs$closeSync.apply(fs, arguments)
      retry()
    }

    Object.defineProperty(closeSync, previousSymbol, {
      value: fs$closeSync
    })
    return closeSync
  })(fs.closeSync)

  if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) {
    process.on('exit', function() {
      debug(fs[gracefulQueue])
      __nccwpck_require__(2357).equal(fs[gracefulQueue].length, 0)
    })
  }
}

if (!global[gracefulQueue]) {
  publishQueue(global, fs[gracefulQueue]);
}

module.exports = patch(clone(fs))
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs.__patched) {
    module.exports = patch(fs)
    fs.__patched = true;
}

function patch (fs) {
  // Everything that references the open() function needs to be in here
  polyfills(fs)
  fs.gracefulify = patch

  fs.createReadStream = createReadStream
  fs.createWriteStream = createWriteStream
  var fs$readFile = fs.readFile
  fs.readFile = readFile
  function readFile (path, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$readFile(path, options, cb)

    function go$readFile (path, options, cb) {
      return fs$readFile(path, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$readFile, [path, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$writeFile = fs.writeFile
  fs.writeFile = writeFile
  function writeFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$writeFile(path, data, options, cb)

    function go$writeFile (path, data, options, cb) {
      return fs$writeFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$writeFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$appendFile = fs.appendFile
  if (fs$appendFile)
    fs.appendFile = appendFile
  function appendFile (path, data, options, cb) {
    if (typeof options === 'function')
      cb = options, options = null

    return go$appendFile(path, data, options, cb)

    function go$appendFile (path, data, options, cb) {
      return fs$appendFile(path, data, options, function (err) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$appendFile, [path, data, options, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  var fs$copyFile = fs.copyFile
  if (fs$copyFile)
    fs.copyFile = copyFile
  function copyFile (src, dest, flags, cb) {
    if (typeof flags === 'function') {
      cb = flags
      flags = 0
    }
    return fs$copyFile(src, dest, flags, function (err) {
      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([fs$copyFile, [src, dest, flags, cb]])
      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    })
  }

  var fs$readdir = fs.readdir
  fs.readdir = readdir
  function readdir (path, options, cb) {
    var args = [path]
    if (typeof options !== 'function') {
      args.push(options)
    } else {
      cb = options
    }
    args.push(go$readdir$cb)

    return go$readdir(args)

    function go$readdir$cb (err, files) {
      if (files && files.sort)
        files.sort()

      if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
        enqueue([go$readdir, [args]])

      else {
        if (typeof cb === 'function')
          cb.apply(this, arguments)
        retry()
      }
    }
  }

  function go$readdir (args) {
    return fs$readdir.apply(fs, args)
  }

  if (process.version.substr(0, 4) === 'v0.8') {
    var legStreams = legacy(fs)
    ReadStream = legStreams.ReadStream
    WriteStream = legStreams.WriteStream
  }

  var fs$ReadStream = fs.ReadStream
  if (fs$ReadStream) {
    ReadStream.prototype = Object.create(fs$ReadStream.prototype)
    ReadStream.prototype.open = ReadStream$open
  }

  var fs$WriteStream = fs.WriteStream
  if (fs$WriteStream) {
    WriteStream.prototype = Object.create(fs$WriteStream.prototype)
    WriteStream.prototype.open = WriteStream$open
  }

  Object.defineProperty(fs, 'ReadStream', {
    get: function () {
      return ReadStream
    },
    set: function (val) {
      ReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  Object.defineProperty(fs, 'WriteStream', {
    get: function () {
      return WriteStream
    },
    set: function (val) {
      WriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  // legacy names
  var FileReadStream = ReadStream
  Object.defineProperty(fs, 'FileReadStream', {
    get: function () {
      return FileReadStream
    },
    set: function (val) {
      FileReadStream = val
    },
    enumerable: true,
    configurable: true
  })
  var FileWriteStream = WriteStream
  Object.defineProperty(fs, 'FileWriteStream', {
    get: function () {
      return FileWriteStream
    },
    set: function (val) {
      FileWriteStream = val
    },
    enumerable: true,
    configurable: true
  })

  function ReadStream (path, options) {
    if (this instanceof ReadStream)
      return fs$ReadStream.apply(this, arguments), this
    else
      return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
  }

  function ReadStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        if (that.autoClose)
          that.destroy()

        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
        that.read()
      }
    })
  }

  function WriteStream (path, options) {
    if (this instanceof WriteStream)
      return fs$WriteStream.apply(this, arguments), this
    else
      return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
  }

  function WriteStream$open () {
    var that = this
    open(that.path, that.flags, that.mode, function (err, fd) {
      if (err) {
        that.destroy()
        that.emit('error', err)
      } else {
        that.fd = fd
        that.emit('open', fd)
      }
    })
  }

  function createReadStream (path, options) {
    return new fs.ReadStream(path, options)
  }

  function createWriteStream (path, options) {
    return new fs.WriteStream(path, options)
  }

  var fs$open = fs.open
  fs.open = open
  function open (path, flags, mode, cb) {
    if (typeof mode === 'function')
      cb = mode, mode = null

    return go$open(path, flags, mode, cb)

    function go$open (path, flags, mode, cb) {
      return fs$open(path, flags, mode, function (err, fd) {
        if (err && (err.code === 'EMFILE' || err.code === 'ENFILE'))
          enqueue([go$open, [path, flags, mode, cb]])
        else {
          if (typeof cb === 'function')
            cb.apply(this, arguments)
          retry()
        }
      })
    }
  }

  return fs
}

function enqueue (elem) {
  debug('ENQUEUE', elem[0].name, elem[1])
  fs[gracefulQueue].push(elem)
}

function retry () {
  var elem = fs[gracefulQueue].shift()
  if (elem) {
    debug('RETRY', elem[0].name, elem[1])
    elem[0].apply(null, elem[1])
  }
}


/***/ }),

/***/ 8612:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Stream = __nccwpck_require__(2413).Stream

module.exports = legacy

function legacy (fs) {
  return {
    ReadStream: ReadStream,
    WriteStream: WriteStream
  }

  function ReadStream (path, options) {
    if (!(this instanceof ReadStream)) return new ReadStream(path, options);

    Stream.call(this);

    var self = this;

    this.path = path;
    this.fd = null;
    this.readable = true;
    this.paused = false;

    this.flags = 'r';
    this.mode = 438; /*=0666*/
    this.bufferSize = 64 * 1024;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.encoding) this.setEncoding(this.encoding);

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.end === undefined) {
        this.end = Infinity;
      } else if ('number' !== typeof this.end) {
        throw TypeError('end must be a Number');
      }

      if (this.start > this.end) {
        throw new Error('start must be <= end');
      }

      this.pos = this.start;
    }

    if (this.fd !== null) {
      process.nextTick(function() {
        self._read();
      });
      return;
    }

    fs.open(this.path, this.flags, this.mode, function (err, fd) {
      if (err) {
        self.emit('error', err);
        self.readable = false;
        return;
      }

      self.fd = fd;
      self.emit('open', fd);
      self._read();
    })
  }

  function WriteStream (path, options) {
    if (!(this instanceof WriteStream)) return new WriteStream(path, options);

    Stream.call(this);

    this.path = path;
    this.fd = null;
    this.writable = true;

    this.flags = 'w';
    this.encoding = 'binary';
    this.mode = 438; /*=0666*/
    this.bytesWritten = 0;

    options = options || {};

    // Mixin options into this
    var keys = Object.keys(options);
    for (var index = 0, length = keys.length; index < length; index++) {
      var key = keys[index];
      this[key] = options[key];
    }

    if (this.start !== undefined) {
      if ('number' !== typeof this.start) {
        throw TypeError('start must be a Number');
      }
      if (this.start < 0) {
        throw new Error('start must be >= zero');
      }

      this.pos = this.start;
    }

    this.busy = false;
    this._queue = [];

    if (this.fd === null) {
      this._open = fs.open;
      this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
      this.flush();
    }
  }
}


/***/ }),

/***/ 670:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var constants = __nccwpck_require__(7619)

var origCwd = process.cwd
var cwd = null

var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform

process.cwd = function() {
  if (!cwd)
    cwd = origCwd.call(process)
  return cwd
}
try {
  process.cwd()
} catch (er) {}

// This check is needed until node.js 12 is required
if (typeof process.chdir === 'function') {
  var chdir = process.chdir
  process.chdir = function (d) {
    cwd = null
    chdir.call(process, d)
  }
  if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir)
}

module.exports = patch

function patch (fs) {
  // (re-)implement some things that are known busted or missing.

  // lchmod, broken prior to 0.6.2
  // back-port the fix here.
  if (constants.hasOwnProperty('O_SYMLINK') &&
      process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    patchLchmod(fs)
  }

  // lutimes implementation, or no-op
  if (!fs.lutimes) {
    patchLutimes(fs)
  }

  // https://github.com/isaacs/node-graceful-fs/issues/4
  // Chown should not fail on einval or eperm if non-root.
  // It should not fail on enosys ever, as this just indicates
  // that a fs doesn't support the intended operation.

  fs.chown = chownFix(fs.chown)
  fs.fchown = chownFix(fs.fchown)
  fs.lchown = chownFix(fs.lchown)

  fs.chmod = chmodFix(fs.chmod)
  fs.fchmod = chmodFix(fs.fchmod)
  fs.lchmod = chmodFix(fs.lchmod)

  fs.chownSync = chownFixSync(fs.chownSync)
  fs.fchownSync = chownFixSync(fs.fchownSync)
  fs.lchownSync = chownFixSync(fs.lchownSync)

  fs.chmodSync = chmodFixSync(fs.chmodSync)
  fs.fchmodSync = chmodFixSync(fs.fchmodSync)
  fs.lchmodSync = chmodFixSync(fs.lchmodSync)

  fs.stat = statFix(fs.stat)
  fs.fstat = statFix(fs.fstat)
  fs.lstat = statFix(fs.lstat)

  fs.statSync = statFixSync(fs.statSync)
  fs.fstatSync = statFixSync(fs.fstatSync)
  fs.lstatSync = statFixSync(fs.lstatSync)

  // if lchmod/lchown do not exist, then make them no-ops
  if (!fs.lchmod) {
    fs.lchmod = function (path, mode, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchmodSync = function () {}
  }
  if (!fs.lchown) {
    fs.lchown = function (path, uid, gid, cb) {
      if (cb) process.nextTick(cb)
    }
    fs.lchownSync = function () {}
  }

  // on Windows, A/V software can lock the directory, causing this
  // to fail with an EACCES or EPERM if the directory contains newly
  // created files.  Try again on failure, for up to 60 seconds.

  // Set the timeout this long because some Windows Anti-Virus, such as Parity
  // bit9, may lock files for up to a minute, causing npm package install
  // failures. Also, take care to yield the scheduler. Windows scheduling gives
  // CPU to a busy looping process, which can cause the program causing the lock
  // contention to be starved of CPU by node, so the contention doesn't resolve.
  if (platform === "win32") {
    fs.rename = (function (fs$rename) { return function (from, to, cb) {
      var start = Date.now()
      var backoff = 0;
      fs$rename(from, to, function CB (er) {
        if (er
            && (er.code === "EACCES" || er.code === "EPERM")
            && Date.now() - start < 60000) {
          setTimeout(function() {
            fs.stat(to, function (stater, st) {
              if (stater && stater.code === "ENOENT")
                fs$rename(from, to, CB);
              else
                cb(er)
            })
          }, backoff)
          if (backoff < 100)
            backoff += 10;
          return;
        }
        if (cb) cb(er)
      })
    }})(fs.rename)
  }

  // if read() returns EAGAIN, then just try it again.
  fs.read = (function (fs$read) {
    function read (fd, buffer, offset, length, position, callback_) {
      var callback
      if (callback_ && typeof callback_ === 'function') {
        var eagCounter = 0
        callback = function (er, _, __) {
          if (er && er.code === 'EAGAIN' && eagCounter < 10) {
            eagCounter ++
            return fs$read.call(fs, fd, buffer, offset, length, position, callback)
          }
          callback_.apply(this, arguments)
        }
      }
      return fs$read.call(fs, fd, buffer, offset, length, position, callback)
    }

    // This ensures `util.promisify` works as it does for native `fs.read`.
    if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read)
    return read
  })(fs.read)

  fs.readSync = (function (fs$readSync) { return function (fd, buffer, offset, length, position) {
    var eagCounter = 0
    while (true) {
      try {
        return fs$readSync.call(fs, fd, buffer, offset, length, position)
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter ++
          continue
        }
        throw er
      }
    }
  }})(fs.readSync)

  function patchLchmod (fs) {
    fs.lchmod = function (path, mode, callback) {
      fs.open( path
             , constants.O_WRONLY | constants.O_SYMLINK
             , mode
             , function (err, fd) {
        if (err) {
          if (callback) callback(err)
          return
        }
        // prefer to return the chmod error, if one occurs,
        // but still try to close, and report closing errors if they occur.
        fs.fchmod(fd, mode, function (err) {
          fs.close(fd, function(err2) {
            if (callback) callback(err || err2)
          })
        })
      })
    }

    fs.lchmodSync = function (path, mode) {
      var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

      // prefer to return the chmod error, if one occurs,
      // but still try to close, and report closing errors if they occur.
      var threw = true
      var ret
      try {
        ret = fs.fchmodSync(fd, mode)
        threw = false
      } finally {
        if (threw) {
          try {
            fs.closeSync(fd)
          } catch (er) {}
        } else {
          fs.closeSync(fd)
        }
      }
      return ret
    }
  }

  function patchLutimes (fs) {
    if (constants.hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function (path, at, mt, cb) {
        fs.open(path, constants.O_SYMLINK, function (er, fd) {
          if (er) {
            if (cb) cb(er)
            return
          }
          fs.futimes(fd, at, mt, function (er) {
            fs.close(fd, function (er2) {
              if (cb) cb(er || er2)
            })
          })
        })
      }

      fs.lutimesSync = function (path, at, mt) {
        var fd = fs.openSync(path, constants.O_SYMLINK)
        var ret
        var threw = true
        try {
          ret = fs.futimesSync(fd, at, mt)
          threw = false
        } finally {
          if (threw) {
            try {
              fs.closeSync(fd)
            } catch (er) {}
          } else {
            fs.closeSync(fd)
          }
        }
        return ret
      }

    } else {
      fs.lutimes = function (_a, _b, _c, cb) { if (cb) process.nextTick(cb) }
      fs.lutimesSync = function () {}
    }
  }

  function chmodFix (orig) {
    if (!orig) return orig
    return function (target, mode, cb) {
      return orig.call(fs, target, mode, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chmodFixSync (orig) {
    if (!orig) return orig
    return function (target, mode) {
      try {
        return orig.call(fs, target, mode)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }


  function chownFix (orig) {
    if (!orig) return orig
    return function (target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function (er) {
        if (chownErOk(er)) er = null
        if (cb) cb.apply(this, arguments)
      })
    }
  }

  function chownFixSync (orig) {
    if (!orig) return orig
    return function (target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid)
      } catch (er) {
        if (!chownErOk(er)) throw er
      }
    }
  }

  function statFix (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options, cb) {
      if (typeof options === 'function') {
        cb = options
        options = null
      }
      function callback (er, stats) {
        if (stats) {
          if (stats.uid < 0) stats.uid += 0x100000000
          if (stats.gid < 0) stats.gid += 0x100000000
        }
        if (cb) cb.apply(this, arguments)
      }
      return options ? orig.call(fs, target, options, callback)
        : orig.call(fs, target, callback)
    }
  }

  function statFixSync (orig) {
    if (!orig) return orig
    // Older versions of Node erroneously returned signed integers for
    // uid + gid.
    return function (target, options) {
      var stats = options ? orig.call(fs, target, options)
        : orig.call(fs, target)
      if (stats.uid < 0) stats.uid += 0x100000000
      if (stats.gid < 0) stats.gid += 0x100000000
      return stats;
    }
  }

  // ENOSYS means that the fs doesn't support the op. Just ignore
  // that, because it doesn't matter.
  //
  // if there's no getuid, or if getuid() is something other
  // than 0, and the error is EINVAL or EPERM, then just ignore
  // it.
  //
  // This specific case is a silent failure in cp, install, tar,
  // and most other unix tools that manage permissions.
  //
  // When running as root, or if other types of errors are
  // encountered, then it's strict.
  function chownErOk (er) {
    if (!er)
      return true

    if (er.code === "ENOSYS")
      return true

    var nonroot = !process.getuid || process.getuid() !== 0
    if (nonroot) {
      if (er.code === "EINVAL" || er.code === "EPERM")
        return true
    }

    return false
  }
}


/***/ }),

/***/ 7415:
/***/ ((module) => {

"use strict";

module.exports = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),

/***/ 9293:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

let _fs
try {
  _fs = __nccwpck_require__(7905)
} catch (_) {
  _fs = __nccwpck_require__(5747)
}
const universalify = __nccwpck_require__(9973)
const { stringify, stripBom } = __nccwpck_require__(3555)

async function _readFile (file, options = {}) {
  if (typeof options === 'string') {
    options = { encoding: options }
  }

  const fs = options.fs || _fs

  const shouldThrow = 'throws' in options ? options.throws : true

  let data = await universalify.fromCallback(fs.readFile)(file, options)

  data = stripBom(data)

  let obj
  try {
    obj = JSON.parse(data, options ? options.reviver : null)
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file}: ${err.message}`
      throw err
    } else {
      return null
    }
  }

  return obj
}

const readFile = universalify.fromPromise(_readFile)

function readFileSync (file, options = {}) {
  if (typeof options === 'string') {
    options = { encoding: options }
  }

  const fs = options.fs || _fs

  const shouldThrow = 'throws' in options ? options.throws : true

  try {
    let content = fs.readFileSync(file, options)
    content = stripBom(content)
    return JSON.parse(content, options.reviver)
  } catch (err) {
    if (shouldThrow) {
      err.message = `${file}: ${err.message}`
      throw err
    } else {
      return null
    }
  }
}

async function _writeFile (file, obj, options = {}) {
  const fs = options.fs || _fs

  const str = stringify(obj, options)

  await universalify.fromCallback(fs.writeFile)(file, str, options)
}

const writeFile = universalify.fromPromise(_writeFile)

function writeFileSync (file, obj, options = {}) {
  const fs = options.fs || _fs

  const str = stringify(obj, options)
  // not sure if fs.writeFileSync returns anything, but just in case
  return fs.writeFileSync(file, str, options)
}

const jsonfile = {
  readFile,
  readFileSync,
  writeFile,
  writeFileSync
}

module.exports = jsonfile


/***/ }),

/***/ 3555:
/***/ ((module) => {

function stringify (obj, { EOL = '\n', finalEOL = true, replacer = null, spaces } = {}) {
  const EOF = finalEOL ? EOL : ''
  const str = JSON.stringify(obj, replacer, spaces)

  return str.replace(/\n/g, EOL) + EOF
}

function stripBom (content) {
  // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
  if (Buffer.isBuffer(content)) content = content.toString('utf8')
  return content.replace(/^\uFEFF/, '')
}

module.exports = { stringify, stripBom }


/***/ }),

/***/ 4377:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 9053:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const Queue = __nccwpck_require__(4251);

const pLimit = concurrency => {
	if (!((Number.isInteger(concurrency) || concurrency === Infinity) && concurrency > 0)) {
		throw new TypeError('Expected `concurrency` to be a number from 1 and up');
	}

	const queue = new Queue();
	let activeCount = 0;

	const next = () => {
		activeCount--;

		if (queue.size > 0) {
			queue.dequeue()();
		}
	};

	const run = async (fn, resolve, ...args) => {
		activeCount++;

		const result = (async () => fn(...args))();

		resolve(result);

		try {
			await result;
		} catch {}

		next();
	};

	const enqueue = (fn, resolve, ...args) => {
		queue.enqueue(run.bind(null, fn, resolve, ...args));

		(async () => {
			// This function needs to wait until the next microtask before comparing
			// `activeCount` to `concurrency`, because `activeCount` is updated asynchronously
			// when the run function is dequeued and called. The comparison in the if-statement
			// needs to happen asynchronously as well to get an up-to-date value for `activeCount`.
			await Promise.resolve();

			if (activeCount < concurrency && queue.size > 0) {
				queue.dequeue()();
			}
		})();
	};

	const generator = (fn, ...args) => new Promise(resolve => {
		enqueue(fn, resolve, ...args);
	});

	Object.defineProperties(generator, {
		activeCount: {
			get: () => activeCount
		},
		pendingCount: {
			get: () => queue.size
		},
		clearQueue: {
			value: () => {
				queue.clear();
			}
		}
	});

	return generator;
};

module.exports = pLimit;


/***/ }),

/***/ 2227:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(2087);
const hasFlag = __nccwpck_require__(7415);

const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};


/***/ }),

/***/ 9973:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.fromCallback = function (fn) {
  return Object.defineProperty(function (...args) {
    if (typeof args[args.length - 1] === 'function') fn.apply(this, args)
    else {
      return new Promise((resolve, reject) => {
        fn.call(
          this,
          ...args,
          (err, res) => (err != null) ? reject(err) : resolve(res)
        )
      })
    }
  }, 'name', { value: fn.name })
}

exports.fromPromise = function (fn) {
  return Object.defineProperty(function (...args) {
    const cb = args[args.length - 1]
    if (typeof cb !== 'function') return fn.apply(this, args)
    else fn.apply(this, args.slice(0, -1)).then(r => cb(null, r), cb)
  }, 'name', { value: fn.name })
}


/***/ }),

/***/ 4251:
/***/ ((module) => {

class Node {
	/// value;
	/// next;

	constructor(value) {
		this.value = value;

		// TODO: Remove this when targeting Node.js 12.
		this.next = undefined;
	}
}

class Queue {
	// TODO: Use private class fields when targeting Node.js 12.
	// #_head;
	// #_tail;
	// #_size;

	constructor() {
		this.clear();
	}

	enqueue(value) {
		const node = new Node(value);

		if (this._head) {
			this._tail.next = node;
			this._tail = node;
		} else {
			this._head = node;
			this._tail = node;
		}

		this._size++;
	}

	dequeue() {
		const current = this._head;
		if (!current) {
			return;
		}

		this._head = this._head.next;
		this._size--;
		return current.value;
	}

	clear() {
		this._head = undefined;
		this._tail = undefined;
		this._size = 0;
	}

	get size() {
		return this._size;
	}

	* [Symbol.iterator]() {
		let current = this._head;

		while (current) {
			yield current.value;
			current = current.next;
		}
	}
}

module.exports = Queue;


/***/ }),

/***/ 2161:
/***/ ((module) => {

module.exports = eval("require")("original-fs");


/***/ }),

/***/ 2995:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"author":{"name":"Matt Zabriskie"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"bugs":{"url":"https://github.com/axios/axios/issues"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}],"dependencies":{"follow-redirects":"^1.10.0"},"description":"Promise based HTTP client for the browser and node.js","devDependencies":{"bundlesize":"^0.17.0","coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.0.2","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^20.1.0","grunt-karma":"^2.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^1.3.0","karma-chrome-launcher":"^2.2.0","karma-coverage":"^1.1.1","karma-firefox-launcher":"^1.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.2.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^5.2.0","sinon":"^4.5.0","typescript":"^2.8.1","url-search-params":"^0.10.0","webpack":"^1.13.1","webpack-dev-server":"^1.14.1"},"homepage":"https://github.com/axios/axios","jsdelivr":"dist/axios.min.js","keywords":["xhr","http","ajax","promise","node"],"license":"MIT","main":"index.js","name":"axios","repository":{"type":"git","url":"git+https://github.com/axios/axios.git"},"scripts":{"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","fix":"eslint --fix lib/**/*.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test && bundlesize","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},"typings":"./index.d.ts","unpkg":"dist/axios.min.js","version":"0.21.1"}');

/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 7619:
/***/ ((module) => {

"use strict";
module.exports = require("constants");

/***/ }),

/***/ 6417:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 3867:
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ../node_modules/axios/index.js
var axios = __nccwpck_require__(8577);
var axios_default = /*#__PURE__*/__nccwpck_require__.n(axios);
// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(5622);
// EXTERNAL MODULE: ../node_modules/fs-extra/lib/index.js
var lib = __nccwpck_require__(5501);
// EXTERNAL MODULE: ../node_modules/adm-zip/adm-zip.js
var adm_zip = __nccwpck_require__(3465);
// EXTERNAL MODULE: ../node_modules/@actions/core/lib/core.js
var core = __nccwpck_require__(5316);
// EXTERNAL MODULE: ../node_modules/p-limit/index.js
var p_limit = __nccwpck_require__(9053);
// EXTERNAL MODULE: ../node_modules/@crowdin/crowdin-api-client/out/index.js
var out = __nccwpck_require__(5085);
var out_default = /*#__PURE__*/__nccwpck_require__.n(out);
;// CONCATENATED MODULE: external "child_process"
const external_child_process_namespaceObject = require("child_process");
;// CONCATENATED MODULE: ./out/shared/utils.js

function wait(millesec) {
    return new Promise(resolve => setTimeout(resolve, millesec));
}
function execute(command) {
    return (0,external_child_process_namespaceObject.execSync)(command).toString();
}
function normalize(text) {
    text = text.trim();
    while (text.includes('\r\n')) {
        text = text.replace('\r\n', '\n');
    }
    while (text.includes('\n\n')) {
        text = text.replace('\n\n', '\n');
    }
    return text;
}
//# sourceMappingURL=utils.js.map
;// CONCATENATED MODULE: ./out/shared/constants.js
const projectId = 51028;
const submodules = ['enc-amf', 'obs-browser', 'obs-vst'];
const sourceEqualityCheck = ['UI', 'plugins'];
const promisesLimit = 10;
//# sourceMappingURL=constants.js.map
;// CONCATENATED MODULE: ./out/download/src/strings.js
const strings = {
    git: {
        committer: {
            name: 'Translation Updater',
            email: '<>'
        },
        commitTitle: 'Update translations from Crowdin'
    },
    authors: {
        header: 'Original Author: Hugh Bailey ("Jim")\n\nContributors are sorted by their amount of commits / translated words.\n\n',
        contributors: 'Contributors',
        translators: 'Translators',
        fileName: 'AUTHORS'
    },
    language: {
        locale: 'en-US',
        name: 'English'
    }
};
/* harmony default export */ const src_strings = (strings);
//# sourceMappingURL=strings.js.map
;// CONCATENATED MODULE: ./out/download/src/index.js










const { reportsApi, translationsApi, usersApi, projectsGroupsApi, sourceFilesApi, sourceStringsApi, translationStatusApi } = new (out_default())({
    token: process.env.CROWDIN_PAT
});
const requestLimit = p_limit(promisesLimit);
function emptyTranslationDir(dirPath) {
    for (const file of lib.readdirSync(dirPath)) {
        if (file !== `${src_strings.language.locale}.ini`) {
            lib.removeSync(external_path_.join(dirPath, file));
        }
    }
}
function removePreviousTranslations() {
    core.info('Removing previous translations.');
    emptyTranslationDir(external_path_.join('UI', 'data', 'locale'));
    emptyTranslationDir(external_path_.join('plugins', 'enc-amf', 'resources', 'locale'));
    for (const file of lib.readdirSync('plugins')) {
        const dirPath = external_path_.join('plugins', file, 'data', 'locale');
        if (lib.existsSync(dirPath) && lib.lstatSync(dirPath).isDirectory()) {
            emptyTranslationDir(dirPath);
        }
    }
}
function prepareBuildProcessing() {
    core.info('Preparing project build.');
    const detachedSubmodules = [];
    for (const submodule of submodules) {
        process.chdir(external_path_.join('plugins', submodule));
        if (execute('git diff master HEAD').length !== 0) {
            detachedSubmodules.push(submodule);
        }
        execute('git checkout master');
        process.chdir('../..');
    }
    return detachedSubmodules;
}
async function getFilePaths() {
    const filePaths = new Map();
    for (const { data: file } of (await sourceFilesApi.listProjectFiles(projectId, { limit: 500 })).data) {
        const fileName = file.name;
        const exportPattern = file.exportOptions.exportPattern.replace('%file_name%', fileName.substring(0, fileName.indexOf('.')));
        filePaths.set(file.id, exportPattern.substring(1, exportPattern.lastIndexOf('/')));
    }
    return filePaths;
}
async function getSourceStrings(filePaths) {
    const sourceFiles = new Map();
    let offset = 0;
    let currentFileId;
    let currentFileStrings;
    while (true) {
        const data = (await sourceStringsApi.listProjectStrings(projectId, { limit: 500, offset: offset })).data;
        if (data.length === 0) {
            break;
        }
        for (const { data: string } of data) {
            const fileId = string.fileId;
            if (filePaths.has(fileId) && !sourceEqualityCheck.includes(filePaths.get(fileId).substring(0, filePaths.get(fileId).indexOf('/')))) {
                continue;
            }
            if (fileId !== currentFileId) {
                if (typeof currentFileId !== 'undefined') {
                    sourceFiles.set(currentFileId, currentFileStrings);
                }
                currentFileId = fileId;
                if (sourceFiles.has(currentFileId)) {
                    currentFileStrings = sourceFiles.get(currentFileId);
                }
                else {
                    currentFileStrings = new Map();
                }
            }
            if (typeof string.text === 'string') {
                currentFileStrings.set(string.identifier, string.text);
            }
        }
        offset += 500;
    }
    return sourceFiles;
}
function generateAuthors(gitContributors, translators) {
    core.info('AUTHORS file.');
    lib.writeFileSync(src_strings.authors.fileName, `${src_strings.authors.header}${gitContributors}${translators}`);
}
function getGitContributors() {
    core.info('Getting Git contributors.');
    let output = `${src_strings.authors.contributors}:\n`;
    for (const line of execute('git shortlog --all -sn --no-merges').split('\n')) {
        const contributor = line.substring(line.indexOf('\t') + 1);
        if (contributor !== src_strings.git.committer.name) {
            output += ` ${contributor}\n`;
        }
    }
    return output;
}
async function getTranslators(targetLanguageIds) {
    core.info('Getting translators.');
    const blockedUsers = [];
    for (const { data: blockedUser } of (await usersApi.listProjectMembers(projectId, undefined, out.UsersModel.Role.BLOCKED, undefined, 500)).data) {
        blockedUsers.push(blockedUser.id);
    }
    const requests = [];
    for (const languageId of targetLanguageIds) {
        async function request() {
            const { status: reportStatus, identifier: reportId } = (await reportsApi.generateReport(projectId, {
                name: 'top-members',
                schema: {
                    unit: out.ReportsModel.Unit.WORDS,
                    format: out.ReportsModel.Format.JSON,
                    dateFrom: '2014-01-01T00:00:00+00:00',
                    dateTo: '2030-01-01T00:00:00+00:00',
                    languageId
                }
            })).data;
            let finished = reportStatus === 'finished';
            while (!finished) {
                await wait(3000);
                finished = (await reportsApi.checkReportStatus(projectId, reportId)).data.status === 'finished';
            }
            return (await axios_default().get((await reportsApi.downloadReport(projectId, reportId)).data.url)).data;
        }
        requests.push(requestLimit(() => request()));
    }
    const topMembers = new Map();
    for (const reportData of await Promise.all(requests)) {
        if (!('data' in reportData)) {
            continue;
        }
        const languageName = reportData.language.name;
        let members;
        if (topMembers.has(languageName)) {
            members = topMembers.get(languageName);
        }
        else {
            members = [];
        }
        for (const userObj of reportData.data) {
            const fullName = userObj.user.fullName;
            if (fullName === 'REMOVED_USER' || blockedUsers.includes(Number(userObj.user.id))) {
                continue;
            }
            if (userObj.translated === 0 && userObj.approved === 0) {
                continue;
            }
            members.push(fullName);
        }
        topMembers.set(languageName, members);
    }
    let output = `${src_strings.authors.translators}:\n`;
    for (const language of new Map([...topMembers].sort((a, b) => String(a[0]).localeCompare(b[0]))).keys()) {
        output += ` ${language}:\n`;
        for (const user of topMembers.get(language)) {
            output += `  ${user}\n`;
        }
    }
    return output;
}
async function buildProject() {
    core.info('Building Crowdin project.');
    if (process.env.CROWDIN_SYNC_SKIP_BUILD) {
        const { id, status } = (await translationsApi.listProjectBuilds(projectId, undefined, 1)).data[0].data;
        if (status === 'finished') {
            return id;
        }
    }
    const { id, status } = (await translationsApi.buildProject(projectId, { skipUntranslatedStrings: true })).data;
    let finished = status === 'finished';
    while (!finished) {
        await wait(5000);
        finished = (await translationsApi.checkBuildStatus(projectId, id)).data.status === 'finished';
    }
    return id;
}
async function getLanguages() {
    const projectData = (await projectsGroupsApi.getProject(projectId)).data;
    const languageCodeMap = new Map();
    for (const language of projectData.targetLanguages) {
        languageCodeMap.set(language.locale, language.id);
    }
    return { languageCodeMap, targetLanguageIds: projectData.targetLanguageIds };
}
async function processBuild(buildId, sourceFiles, filePaths) {
    core.info('Processing build.');
    const translatedSourceMap = new Map();
    for (const key of sourceFiles.keys()) {
        if (filePaths.has(key)) {
            translatedSourceMap.set(filePaths.get(key), sourceFiles.get(key));
        }
    }
    const zipFile = new adm_zip((await axios_default().get((await translationsApi.downloadTranslations(projectId, buildId)).data.url, { responseType: 'arraybuffer' })).data);
    const desktopFileTranslations = new Map();
    const languageList = new Map();
    for (const zipEntry of zipFile.getEntries()) {
        const entryFullPath = zipEntry.entryName;
        const { dir: entryDir, name: entryName } = external_path_.parse(entryFullPath);
        if (entryDir === 'Website') {
            continue;
        }
        let fileContent = normalize(zipFile.readAsText(zipEntry));
        if (fileContent.length === 0) {
            continue;
        }
        let fixedLineBreaks = '';
        for (const line of fileContent.trimEnd().split('\n')) {
            if (line.includes('="') && line.indexOf('="') !== line.length - 2) {
                fixedLineBreaks += '\n';
            }
            else {
                fixedLineBreaks += '\\n';
            }
            fixedLineBreaks += line;
        }
        fileContent = fixedLineBreaks.trimStart();
        if (entryDir === 'desktop-entry') {
            const translations = new Map();
            for (const line of fileContent.split('\n')) {
                translations.set(line.substring(0, line.indexOf('=')), line.substring(line.indexOf('"') + 1, line.lastIndexOf('"')));
            }
            desktopFileTranslations.set(entryName, translations);
            continue;
        }
        let translationContent = '';
        if (translatedSourceMap.has(entryDir)) {
            let readLanguageName = false;
            if (entryDir === 'UI/data/locale') {
                readLanguageName = true;
            }
            for (const line of fileContent.split('\n')) {
                const key = line.substring(0, line.indexOf('='));
                const value = line.substring(line.indexOf('"') + 1, line.length - 1);
                if (value !== translatedSourceMap.get(entryDir).get(key)) {
                    translationContent += `${line}\n`;
                    if (readLanguageName && key === 'Language') {
                        languageList.set(entryName, value);
                        readLanguageName = false;
                    }
                }
            }
            if (translationContent.length === 0) {
                continue;
            }
        }
        else {
            translationContent = `${fileContent}\n`;
        }
        lib.writeFileSync(entryFullPath, translationContent);
    }
    return { desktopFileTranslations: new Map([...desktopFileTranslations].sort((a, b) => String(a[0]).localeCompare(b[0]))), languageList };
}
function desktopFile(languageFiles) {
    core.info('UI/xdg-data/com.obsproject.Studio.desktop');
    const filePath = external_path_.join('UI', 'xdg-data', 'com.obsproject.Studio.desktop');
    const desktopFile = normalize(lib.readFileSync(filePath, 'utf-8'));
    let result = '';
    for (const line of desktopFile.split('\n')) {
        if (line.length === 0) {
            continue;
        }
        if (!(line.startsWith('GenericName[') || line.startsWith('Comment['))) {
            result += `${line}\n`;
        }
    }
    result += '\n';
    for (const language of languageFiles.entries()) {
        for (const translation of language[1].entries()) {
            result += `${translation[0]}[${language[0]}]=${translation[1]}\n`;
        }
    }
    lib.writeFileSync(filePath, result);
}
async function languagesFile(languageList, languageCodeMap) {
    core.info('UI/data/locale.ini');
    const progressMap = new Map();
    for (const { data: language } of (await translationStatusApi.getProjectProgress(projectId, 500)).data) {
        progressMap.set(language.languageId, language.translationProgress);
    }
    const languagesInList = [];
    const languagueListPath = external_path_.join('UI', 'data', 'locale.ini');
    for (const line of normalize(lib.readFileSync(languagueListPath, 'utf-8')).split('\n')) {
        if (line.startsWith('[') && line !== `[${src_strings.language.locale}]`) {
            languagesInList.push(line.substring(1, line.length - 1));
        }
    }
    const finalLanguages = [];
    for (const [locale, languageId] of languageCodeMap.entries()) {
        if (progressMap.has(languageId)) {
            const progress = progressMap.get(languageId);
            if ((languagesInList.includes(locale) && progress >= 30) || progress >= 60) {
                finalLanguages.push(locale);
            }
        }
    }
    finalLanguages.push(src_strings.language.locale);
    languageList.set(src_strings.language.locale, src_strings.language.name);
    let result = '';
    for (const locale of finalLanguages.sort()) {
        if (languageList.has(locale)) {
            result += `[${locale}]\nName=${languageList.get(locale)}\n\n`;
        }
        else {
            core.error(`${locale} was supposed to be included but is missing the language name ('Language' string in 'Main Application' file).`);
        }
    }
    lib.writeFileSync(languagueListPath, `${result.trimEnd()}\n`);
}
function pushChanges(detachedSubmodules) {
    if (process.env.CROWDIN_SYNC_SKIP_PUSH) {
        return;
    }
    core.info('Pushing changes.');
    execute(`git config --global user.name '${src_strings.git.committer.name}'`);
    execute(`git config --global user.email '${src_strings.git.committer.email}'`);
    for (const submodule of submodules) {
        process.chdir(external_path_.join('plugins', submodule));
        if (execute('git status --porcelain').length === 0) {
            process.chdir('../..');
            continue;
        }
        execute('git add .');
        execute(`git commit -m '${src_strings.git.commitTitle}'`);
        execute('git push');
        process.chdir('../..');
    }
    execute('git add .');
    for (const submodule of detachedSubmodules) {
        core.info(`${submodule} has commits not pushed to the main repository. Only pushing to submodule.`);
        execute(`git checkout HEAD -- plugins/${submodule}`);
        execute(`git submodule update --init plugins/${submodule}`);
    }
    if (execute('git status --porcelain').length === 0) {
        core.info('No changes in main repository. Skipping push.');
        return;
    }
    execute(`git commit -m '${src_strings.git.commitTitle}'`);
    execute('git push');
}
(async () => {
    try {
        removePreviousTranslations();
        const results = [];
        results[0] = await Promise.all([prepareBuildProcessing(), await getFilePaths(), await buildProject(), await getLanguages()]);
        results[1] = await Promise.all([generateAuthors(getGitContributors(), await getTranslators(results[0][3].targetLanguageIds)), await processBuild(results[0][2], await getSourceStrings(results[0][1]), results[0][1])]);
        await languagesFile(results[1][1].languageList, results[0][3].languageCodeMap);
        desktopFile(results[1][1].desktopFileTranslations);
        pushChanges(results[0][0]);
    }
    catch (error) {
        console.error(error);
        core.setFailed(error);
    }
})();
//# sourceMappingURL=index.js.map
})();

module.exports = __webpack_exports__;
/******/ })()
;