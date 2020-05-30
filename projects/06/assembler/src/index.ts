import fs from 'fs'
import readline from 'readline'
import { VARIABLE_MEMORY_OFFSET } from './constants'
import {
  LineType,
  parseLine,
  getSymbol,
  getLabel,
  parseCInstruction,
  getDestCode,
  getCompCode,
  getJumpCode,
} from './parser'
import * as symbolTable from './symbolTable'

const [inPath, outPath] = process.argv.slice(2)
const readStream = fs.createReadStream(inPath)
// const writeStream = fs.createWriteStream(outPath, { flags: 'a' })

console.log('symbolTable before?', symbolTable.default)

// https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
function readLines(path: string, onLine: (line: string) => void = () => {}) {
  // const fileStream = fs.createReadStream(path)

  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
  })

  rl.on('line', onLine)

  return new Promise(resolve => rl.on('close', resolve))
}

async function addLabels(path: string) {
  let lineNumber = 0
  // let addressNumber = VARIABLE_MEMORY_OFFSET

  await readLines(path, line => {
    console.log('line??', line)
    const l = parseLine(line)
    console.log('l', l)
    if (l.type === LineType.LABEL) {
      const label = getLabel(l)
      console.log('label', label)
      console.log('addressNumber', lineNumber)
      symbolTable.addSymbol(label, lineNumber)
    }

    if (l.type === LineType.A_INSTRUCTION || l.type === LineType.C_INSTRUCTION) {
      lineNumber++
    } 
  })
}

async function main() {
  await addLabels(inPath)
  console.log('symbolTable after?', symbolTable.default)
}

main()


