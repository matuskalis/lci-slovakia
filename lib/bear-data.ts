import { readFile } from "fs/promises"
import path from "path"

const CSV_PATH = path.join(process.cwd(), "data", "medvede-export.csv")

// Coordinates are rounded to 2 decimals for the public map. At Slovak latitudes
// that is roughly a 1.1 km x 0.7 km grid: the map looks the same at country
// zoom, but the exported points are too coarse to lead anyone to a den site.
const PUBLIC_COORDINATE_DECIMALS = 2

const NOTE_INDEX = 3
const DATE_INDEX = 2
const HOUR_INDEX = 6
const LATITUDE_INDEX = 7
const LONGITUDE_INDEX = 8

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

function roundCoordinate(value: string): string {
  const parsed = Number.parseFloat(value.replace(",", "."))
  if (Number.isNaN(parsed)) return value
  return parsed.toFixed(PUBLIC_COORDINATE_DECIMALS).replace(".", ",")
}

/**
 * Strips the public map payload down to what the map actually draws: category,
 * month, and a coarse position. Removes the Poznamka column, which carries the
 * names of the Lesy SR staff who filed each record, and the exact time of day.
 * Keeps the CSV shape so the map parser does not change.
 */
export function toPublicCsv(csvText: string): string {
  const lines = csvText.trim().split("\n")

  const publicLines = lines.slice(1).map((line) => {
    const values = splitCsvLine(line)

    values[NOTE_INDEX] = ""
    values[DATE_INDEX] = values[DATE_INDEX].slice(0, 10)
    values[HOUR_INDEX] = ""
    values[LATITUDE_INDEX] = roundCoordinate(values[LATITUDE_INDEX])
    values[LONGITUDE_INDEX] = roundCoordinate(values[LONGITUDE_INDEX])

    return values
      .map((value, index) => {
        const needsQuotes = index === LATITUDE_INDEX || index === LONGITUDE_INDEX || /[,"\n]/.test(value)
        return needsQuotes ? `"${value.replace(/"/g, '""')}"` : value
      })
      .join(",")
  })

  return [lines[0], ...publicLines].join("\n") + "\n"
}
