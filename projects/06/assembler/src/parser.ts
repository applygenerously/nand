import {
  destTable,
  jumpTable,
  compTable
} from './constants'

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
export enum LineType {
  A_INSTRUCTION = 'A_INSTRUCTION',
  C_INSTRUCTION = 'C_INSTRUCTION',
  LABEL = 'LABEL',
  // ignore comments and newlines
  IGNORE = 'IGNORE',
}

type AInstruction = {
  value: string,
  type: LineType.A_INSTRUCTION
}

type CInstruction = {
  value: string,
  type: LineType.C_INSTRUCTION
}

type Label = {
  value: string,
  type: LineType.LABEL
}

type Ignore = {
  value: string,
  type: LineType.IGNORE
}

type line = 
  | AInstruction
  | CInstruction
  | Label
  | Ignore

const regexps = {
  a: /^@(.*)/,
  c: /([ADM]|null){1,3}=?([ADM!\-+|&10]){0,3};?([JGTEQLNMP]|null){0,4}/,
  l: /^\((.*)\)$/,
  comment: /^\/\//,
  newline: /^\s{0}$/,
}

function getCommandType(line: string) {
  if (regexps.comment.test(line) || regexps.newline.test(line)) return LineType.IGNORE
  if (regexps.l.test(line)) return LineType.LABEL
  if (regexps.a.test(line)) return LineType.A_INSTRUCTION
  if (regexps.c.test(line)) return LineType.C_INSTRUCTION
  throw new SyntaxError(`${line} is not a valid instruction`)
}

function parseLine(line: string): line {
  // remove same line comments
  const sanitized = line.replace(/\/\/(.*)/, '').trim()
  return {
    value: sanitized,
    type: getCommandType(sanitized)t
  }
}

function getSymbol(aInstruction: AInstruction) {
  const [, match] = regexps.c.exec(aInstruction.value) || []
  return match
}

function getLabel(label: Label) {
  const [, match] = regexps.l.exec(label.value) || []
  return match
}

function parseCInstruction({ value }: CInstruction) {
  if (value.includes('=') && value.includes('&')) {
    const [dest, comp, jump] = value.split(/=|;/g)
    return { dest, comp, jump }
  }

  if (value.includes('=')) {
    const [dest, comp] = value.split(/=|;/g)
    return { dest, comp }
  }

  if (value.includes(';')) {
    const [comp, jump] = value.split(/=|;/g)
    return { comp, jump }
  }
}

function getDestCode(dest: string) {
  return destTable.get(dest)
}

function getCompCode(comp: string) {
  return compTable.get(comp)
}

function getJumpCode(jump: string) {
  return jumpTable.get(jump)
}

export {
  parseLine,
  getSymbol,
  getLabel,
  parseCInstruction,
  getDestCode,
  getCompCode,
  getJumpCode,
}