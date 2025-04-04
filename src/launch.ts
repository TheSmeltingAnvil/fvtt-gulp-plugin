import { launchFoundry } from "@foundryvtt/utils"
import process from "process"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"

/**
 * Launch Foundry VTT server locally.
 * @returns: Promise<void>
 */
export async function launch(done: () => void) {
  const argv = (await yargs(hideBin(process.argv)).options({
    demo: { type: "boolean", default: false },
    port: { type: "number", default: 30000 },
    world: { type: "string" },
    noupnp: { type: "boolean", default: false },
    noupdate: { type: "boolean", default: false },
  }).argv) as { demo?: boolean; port: number; world?: string; noupnp: boolean; noupdate: boolean }

  launchFoundry(".", argv)
  done()
}

////yargs.option("adminKey", {
////  describe: "The admin key to secure Foundry VTT's Setup screen with",
////  type: "string"
////});
