import * as utils from "@foundryvtt/utils"
import * as fse from "fs-extra"
import * as YAML from "js-yaml"
import path from "node:path"

export async function extractPack(
  directory: string,
  documentType: utils.DocumentType,
  { yamlOptions }: { yamlOptions: YAML.DumpOptions } = { yamlOptions: {} },
): Promise<void> {
  const exists = await fse.exists(`dist/packs/${directory}`)
  if (!exists) return // early exit if no directory found.

  const src = path.resolve(`dist/packs/${directory}`).split(path.sep).join(path.posix.sep)
  const dst = src.replace("dist/packs/", "packs/")
  try {
    yamlOptions = { ...defaultYamlOptions, ...yamlOptions }
    await utils.extractPack(src, dst, { documentType, yaml: true, yamlOptions, log: true })
  } catch (e) {
    console.error(e)
  }
}

const defaultYamlOptions: YAML.DumpOptions = {
  indent: 2,
  lineWidth: 120,
  noCompatMode: true,
  quotingType: '"',
}
