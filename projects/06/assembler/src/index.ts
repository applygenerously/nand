import fs from 'fs'
import readline from 'readline'
import { VARIABLE_MEMORY_OFFSET } from './constants'
import {
  LineType,
  parseLine,
  getSymbol,
  getLabel,
  parseCInstruction,
  parseAInstruction,
} from './parser'
import * as symbolTable from './symbolTable'

const [inPath, outPath] = process.argv.slice(2)

function mkdirp(path: string) {
  fs.mkdirSync(path, { recursive: true })
}

// https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
function readLines(path: string, onLine: (line: string) => void = () => {}) {
  const readStream = fs.createReadStream(inPath)
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity
  })
  
  rl.on('line', onLine)
  
  return new Promise(resolve => rl.on('close', resolve))
}

async function addLabels(path: string) {
  let lineNumber = 0
  
  await readLines(path, line => {
    const l = parseLine(line)
    if (l.type === LineType.LABEL) {
      const label = getLabel(l)
      symbolTable.addSymbol(label, lineNumber)
    }
    
    if (l.type === LineType.A_INSTRUCTION || l.type === LineType.C_INSTRUCTION) {
      lineNumber++
    } 
  })
}

async function assemble(inPath: string, outPath: string) {
  const writeStream = fs.createWriteStream(outPath, { flags: 'a' })
  let addressNumber = VARIABLE_MEMORY_OFFSET

  await readLines(inPath, line => {
    const l = parseLine(line)
    if (l.type === LineType.A_INSTRUCTION) {
      const symbol = getSymbol(l)
      const isVariable = isNaN(parseInt(symbol))
      if (isVariable && !symbolTable.contains(symbol)) {
        symbolTable.addSymbol(symbol, addressNumber)
        addressNumber++
      }
      const address = isVariable 
        ? symbolTable.getAddress(symbol)
        : symbol
      const instruction = parseAInstruction(parseInt(String(address)))
      writeStream.write(instruction + '\n')
    } 

    // if A-instruction encountered where symbol is not a number, look up in symbol table
    // if it exists, replace with numeric meaning
    // else, it must represent a new variable. add it to symbol table
    
    if (l.type === LineType.C_INSTRUCTION) {
      const instruction = parseCInstruction(l)
      writeStream.write(instruction + '\n')
    }
  })
  writeStream.end()
}

async function main() {
  await addLabels(inPath)
  await assemble(inPath, outPath)
}

main()


