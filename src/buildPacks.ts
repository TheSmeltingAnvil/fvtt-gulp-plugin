import { compilePack, extractPack } from "@foundryvtt/utils"
import * as fse from "fs-extra"
import path from "node:path"

/**
 * Build packs: convert to JSON, compile packs database and copy to output directory.
 * @param distPath
 * @param distPath
 * @param {*} done Callback to notify task completes.
 */
export async function buildPacks(done: () => void): Promise<void> {
  const exists = await fse.exists("packs")
  if (!exists) return done() // early exit if no directory found.

  const dirs = await getDirectories("packs")
  if (dirs.length === 0) return // nothing to do!

  for (const dir of dirs) {
    const src = path.resolve("packs", dir).split(path.sep).join(path.posix.sep)
    const dst = src.replace("packs", "dist/packs")
    try {
      await compilePack(src, dst, { yaml: true, recursive: true, log: true })
    } catch (e) {
      console.error(e)
    }
  }

  done()
}

export async function extractPacks(done: () => void): Promise<void> {
  const exists = await fse.exists("dist/packs")
  if (!exists) return done() // early exit if no directory found.

  const dirs = await getDirectories("dist/packs")
  if (dirs.length === 0) return // nothing to do!

  for (const dir of dirs) {
    const src = path.resolve("dist/packs", dir).split(path.sep).join(path.posix.sep)
    const dst = src.replace("dist/packs", "packs")
    try {
      await extractPack(src, dst, { yaml: true, yamlOptions, log: true })
    } catch (e) {
      console.error(e)
    }
  }

  done()
}

/** Get sub-directories. */
async function getDirectories(dir: string): Promise<string[]> {
  const files = await fse.readdir(dir)
  return files.filter(async (file: string) => {
    const filepath = path.join(dir, file)
    const stat = await fse.stat(filepath)
    return stat.isDirectory()
  })
}

const yamlOptions = {
  indent: 2,
  lineWidth: 120,
  noCompatMode: true,
  quotingType: "'",
}
