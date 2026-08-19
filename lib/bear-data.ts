import { readFile } from "fs/promises"
import path from "path"

const CSV_PATH = path.join(process.cwd(), "data", "medvede-export.csv")

const NOTE_INDEX = 3

export async function readBearCsv(): Promise<string> {
  return readFile(CSV_PATH, "utf-8")
}

function splitCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ""
  let inQuotes = false

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      values.push(current)
      current = ""
    } else {
      current += char
    }
  }
  values.push(current)

  return values
}

const LATITUDE_INDEX = 7
const LONGITUDE_INDEX = 8

/**
 * The dataset is open: full-precision coordinates, full date and time. The only
 * column withheld is Poznamka, which carries free text written by Lesy SR staff
 * and names identifiable people — the staff who filed a record, witnesses, and
 * in a handful of rows the victim of a bear attack. Those names are personal
 * data of third parties and LCI has no legal basis to publish them.
 */
export function toOpenCsv(csvText: string): string {
  const lines = csvText.trim().split("\n")

  const openLines = lines.slice(1).map((line) => {
    const values = splitCsvLine(line)

    values[NOTE_INDEX] = ""

    return values
      .map((value, index) => {
        const needsQuotes = index === LATITUDE_INDEX || index === LONGITUDE_INDEX || /[,"\n]/.test(value)
        return needsQuotes ? `"${value.replace(/"/g, '""')}"` : value
      })
      .join(",")
  })

  return [lines[0], ...openLines].join("\n") + "\n"
}
