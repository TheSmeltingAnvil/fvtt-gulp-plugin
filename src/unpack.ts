import * as utils from "@foundryvtt/utils"
import * as fse from "fs-extra"
import * as YAML from "js-yaml"
import path from "node:path"

export async function unpack(done: () => void): Promise<void> {
  const exists = await fse.exists(`dist/packs`)
  if (!exists) return done() // early exit if no directory found.

  const dirs = await getDirectories("dist/packs")
  if (dirs.length === 0) return // nothing to do!

  for (const dir of dirs) {
    const src = path.resolve("dist/packs/", dir).split(path.sep).join(path.posix.sep)
    const dst = src.replace("dist/packs/", "packs/")
    try {
      await utils.extractPack(src, dst, { yaml: true, yamlOptions: defaultYamlOptions, log: true })
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

const defaultYamlOptions: YAML.DumpOptions = {
  indent: 2,
  lineWidth: 120,
  noCompatMode: true,
  quotingType: '"',
}
