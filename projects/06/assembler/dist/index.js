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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var readline_1 = __importDefault(require("readline"));
var constants_1 = require("./constants");
var parser_1 = require("./parser");
var symbolTable = __importStar(require("./symbolTable"));
var _a = process.argv.slice(2), inPath = _a[0], outPath = _a[1];
function mkdirp(path) {
    fs_1["default"].mkdirSync(path, { recursive: true });
}
// https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
function readLines(path, onLine) {
    if (onLine === void 0) { onLine = function () { }; }
    var readStream = fs_1["default"].createReadStream(inPath);
    var rl = readline_1["default"].createInterface({
        input: readStream,
        crlfDelay: Infinity
    });
    rl.on('line', onLine);
    return new Promise(function (resolve) { return rl.on('close', resolve); });
}
function addLabels(path) {
    return __awaiter(this, void 0, void 0, function () {
        var lineNumber;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lineNumber = 0;
                    return [4 /*yield*/, readLines(path, function (line) {
                            var l = parser_1.parseLine(line);
                            if (l.type === parser_1.LineType.LABEL) {
                                var label = parser_1.getLabel(l);
                                symbolTable.addSymbol(label, lineNumber);
                            }
                            if (l.type === parser_1.LineType.A_INSTRUCTION || l.type === parser_1.LineType.C_INSTRUCTION) {
                                lineNumber++;
                            }
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function assemble(inPath, outPath) {
    return __awaiter(this, void 0, void 0, function () {
        var writeStream, addressNumber;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    writeStream = fs_1["default"].createWriteStream(outPath, { flags: 'a' });
                    addressNumber = constants_1.VARIABLE_MEMORY_OFFSET;
                    return [4 /*yield*/, readLines(inPath, function (line) {
                            var l = parser_1.parseLine(line);
                            if (l.type === parser_1.LineType.A_INSTRUCTION) {
                                var symbol = parser_1.getSymbol(l);
                                var isVariable = isNaN(parseInt(symbol));
                                if (isVariable && !symbolTable.contains(symbol)) {
                                    symbolTable.addSymbol(symbol, addressNumber);
                                    addressNumber++;
                                }
                                var address = isVariable
                                    ? symbolTable.getAddress(symbol)
                                    : symbol;
                                var instruction = parser_1.parseAInstruction(parseInt(String(address)));
                                writeStream.write(instruction + '\n');
                            }
                            // if A-instruction encountered where symbol is not a number, look up in symbol table
                            // if it exists, replace with numeric meaning
                            // else, it must represent a new variable. add it to symbol table
                            if (l.type === parser_1.LineType.C_INSTRUCTION) {
                                var instruction = parser_1.parseCInstruction(l);
                                writeStream.write(instruction + '\n');
                            }
                        })];
                case 1:
                    _a.sent();
                    writeStream.end();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addLabels(inPath)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, assemble(inPath, outPath)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=index.js.map