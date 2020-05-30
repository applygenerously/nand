"use strict";
exports.__esModule = true;
exports.getJumpCode = exports.getCompCode = exports.getDestCode = exports.parseCInstruction = exports.getLabel = exports.getSymbol = exports.parseLine = exports.LineType = void 0;
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
    var _a = regexps.c.exec(aInstruction.value) || [], match = _a[1];
    return match;
}
exports.getSymbol = getSymbol;
function getLabel(label) {
    var _a = regexps.l.exec(label.value) || [], match = _a[1];
    return match;
}
exports.getLabel = getLabel;
function parseCInstruction(_a) {
    var value = _a.value;
    if (value.includes('=') && value.includes('&')) {
        var _b = value.split(/=|;/g), dest = _b[0], comp = _b[1], jump = _b[2];
        return { dest: dest, comp: comp, jump: jump };
    }
    if (value.includes('=')) {
        var _c = value.split(/=|;/g), dest = _c[0], comp = _c[1];
        return { dest: dest, comp: comp };
    }
    if (value.includes(';')) {
        var _d = value.split(/=|;/g), comp = _d[0], jump = _d[1];
        return { comp: comp, jump: jump };
    }
}
exports.parseCInstruction = parseCInstruction;
function getDestCode(dest) {
    return constants_1.destTable.get(dest);
}
exports.getDestCode = getDestCode;
function getCompCode(comp) {
    return constants_1.compTable.get(comp);
}
exports.getCompCode = getCompCode;
function getJumpCode(jump) {
    return constants_1.jumpTable.get(jump);
}
exports.getJumpCode = getJumpCode;
//# sourceMappingURL=parser.js.map