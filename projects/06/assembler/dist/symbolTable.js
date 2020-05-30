"use strict";
exports.__esModule = true;
exports.contains = exports.getAddress = exports.addSymbol = void 0;
/**
 * tracks symbols and associated memory locations,
 * initialized with predefined symbols
 */
var symbolTable = new Map([
    ['SP', 0],
    ['LCL', 1],
    ['ARG', 2],
    ['THIS', 3],
    ['THAT', 4],
    ['R0', 0],
    ['R1', 1],
    ['R2', 2],
    ['R3', 3],
    ['R4', 4],
    ['R5', 5],
    ['R6', 6],
    ['R7', 7],
    ['R8', 8],
    ['R9', 9],
    ['R10', 10],
    ['R11', 11],
    ['R12', 12],
    ['R13', 13],
    ['R14', 14],
    ['R15', 15],
    ['SCREEN', 16384],
    ['KBD', 24576],
]);
function addSymbol(symbol, address) {
    symbolTable.set(symbol, address);
}
exports.addSymbol = addSymbol;
function getAddress(symbol) {
    if (!symbolTable.has(symbol))
        throw new Error(symbol + " not found in symbol table");
    return symbolTable.get(symbol);
}
exports.getAddress = getAddress;
function contains(symbol) {
    return symbolTable.has(symbol);
}
exports.contains = contains;
exports["default"] = symbolTable;
//# sourceMappingURL=symbolTable.js.map