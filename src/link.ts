import { getFoundryConfigInfo, getFoundryPackageInfo } from "@foundryvtt/utils"
import console from "console"
import * as fse from "fs-extra"
import path from "path"
import process from "process"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

/********************/
/*       LINK       */
/********************/

/**
 * Link dist directory to first existing Foundry User Data folder
 * @returns: Promise<void>
 */
export async function link(done: () => void) {
  const foundryPackage = await getFoundryPackageInfo()
  const foundryConfig = await getFoundryConfigInfo()
  if (!foundryPackage || !foundryConfig) return done()

  const linkDirectories = foundryConfig.resolvedDataPath.map((dataPath: string) =>
    path.resolve(dataPath, "Data", foundryPackage.path),
  )

  const argv = yargs(hideBin(process.argv)).options({
    clean: { type: "boolean", default: false },
  }).argv as { clean: boolean }
  const clean = argv.clean

  for (const linkDirectory of linkDirectories) {
    if (clean) {
      console.log(`Removing build in ${linkDirectory}.`)
      await fse.remove(linkDirectory)
    } else if (!(await fse.exists(linkDirectory))) {
      console.log(`Linking dist to ${linkDirectory}.`)
      await fse.ensureDir("dist")
      await fse.ensureDir(path.resolve(linkDirectory, ".."))
      await fse.symlink(path.resolve("dist"), linkDirectory)
    } else {
      console.log(`Skipped linking to ${linkDirectory}, as it already exists.`)
    }
  }
}
