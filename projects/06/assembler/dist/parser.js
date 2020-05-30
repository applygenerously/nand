"use strict";
exports.__esModule = true;
exports.parseAInstruction = exports.parseCInstruction = exports.getLabel = exports.getSymbol = exports.parseLine = exports.LineType = void 0;
var constants_1 = require("./constants");
/**
 * A_INSTRUCTION
 * address command
 * @xxx
 * ex. @15
 * ex. @i
 *
 * C_INSTRUCTION
 * compute command
 * dest=comp;jump
 * ex. MD=D+1
 * ex. D;JEQ
 *
 * LABEL
 * label command
 * (xxx)
 * ex. (LOOP)
 */
var LineType;
(function (LineType) {
    LineType["A_INSTRUCTION"] = "A_INSTRUCTION";
    LineType["C_INSTRUCTION"] = "C_INSTRUCTION";
    LineType["LABEL"] = "LABEL";
    // ignore comments and newlines
    LineType["IGNORE"] = "IGNORE";
})(LineType = exports.LineType || (exports.LineType = {}));
var regexps = {
    a: /^@(.*)/,
    c: /([ADM]|null){1,3}=?([ADM!\-+|&10]){0,3};?([JGTEQLNMP]|null){0,4}/,
    l: /^\((.*)\)$/,
    comment: /^\/\//,
    newline: /^\s{0}$/
};
function getCommandType(line) {
    if (regexps.comment.test(line) || regexps.newline.test(line))
        return LineType.IGNORE;
    if (regexps.l.test(line))
        return LineType.LABEL;
    if (regexps.a.test(line))
        return LineType.A_INSTRUCTION;
    if (regexps.c.test(line))
        return LineType.C_INSTRUCTION;
    throw new SyntaxError(line + " is not a valid instruction");
}
function parseLine(line) {
    // remove same line comments
    var sanitized = line.replace(/\/\/(.*)/, '').trim();
    return {
        value: sanitized,
        type: getCommandType(sanitized)
    };
}
exports.parseLine = parseLine;
function getSymbol(aInstruction) {
    var _a = regexps.a.exec(aInstruction.value) || [], match = _a[1];
    return match;
}
exports.getSymbol = getSymbol;
function getLabel(label) {
    var _a = regexps.l.exec(label.value) || [], match = _a[1];
    return match;
}
exports.getLabel = getLabel;
function getDestCode(dest) {
    return constants_1.destTable.get(dest);
}
function getCompCode(comp) {
    if (comp === null)
        return;
    return constants_1.compTable.get(comp);
}
function getJumpCode(jump) {
    return constants_1.jumpTable.get(jump);
}
function decimalToBinary(n) {
    return (n >>> 0).toString(2);
}
function zipWith(a, b, fn) {
    return a.map(function (a, i) { return fn(a, b[i]); });
}
function getCInstructionParts(_a) {
    var value = _a.value;
    if (value.includes('=') && value.includes('&')) {
        var _b = value.split(/=|;/g), dest = _b[0], comp = _b[1], jump = _b[2];
        // return [dest, comp, jump]
        return [comp, dest, jump];
    }
    if (value.includes('=')) {
        var _c = value.split(/=|;/g), dest = _c[0], comp = _c[1];
        // return [dest, comp, null]
        return [comp, dest, null];
    }
    if (value.includes(';')) {
        var _d = value.split(/=|;/g), comp = _d[0], jump = _d[1];
        // return [null, comp, jump]
        return [comp, null, jump];
    }
    return [null, null, null];
}
function parseCInstruction(instruction) {
    var parts = getCInstructionParts(instruction);
    var codes = zipWith(parts, [getCompCode, getDestCode, getJumpCode], function (part, fn) { return fn(part); });
    return "111" + codes.join('');
}
exports.parseCInstruction = parseCInstruction;
function parseAInstruction(address) {
    return "0" + decimalToBinary(address).padStart(15, '0');
}
exports.parseAInstruction = parseAInstruction;
//# sourceMappingURL=parser.js.map