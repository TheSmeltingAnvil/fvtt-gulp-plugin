"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  buildPacks: () => buildPacks,
  launch: () => launch,
  link: () => link
});
module.exports = __toCommonJS(index_exports);

// src/buildPacks.ts
var import_utils = require("@foundryvtt/utils");
var fse = __toESM(require("fs-extra"));
var import_node_path = __toESM(require("path"));
async function buildPacks(done) {
  const exists3 = await fse.exists("packs");
  if (!exists3) return done();
  const dirs = await getDirectories("packs");
  if (dirs.length === 0) return;
  for (const dir of dirs) {
    const src = import_node_path.default.resolve("packs", dir).split(import_node_path.default.sep).join(import_node_path.default.posix.sep);
    const dst = src.replace("packs", "dist/packs");
    try {
      await (0, import_utils.compilePack)(src, dst, { yaml: true, recursive: true, log: true });
    } catch (e) {
      console.error(e);
    }
  }
  done();
}
async function getDirectories(dir) {
  const files = await fse.readdir(dir);
  return files.filter(async (file) => {
    const filepath = import_node_path.default.join(dir, file);
    const stat2 = await fse.stat(filepath);
    return stat2.isDirectory();
  });
}

// src/launch.ts
var import_utils2 = require("@foundryvtt/utils");
var import_process = __toESM(require("process"));
var import_yargs = __toESM(require("yargs"));
var import_helpers = require("yargs/helpers");
async function launch(done) {
  const argv = await (0, import_yargs.default)((0, import_helpers.hideBin)(import_process.default.argv)).options({
    demo: { type: "boolean", default: false },
    port: { type: "number", default: 3e4 },
    world: { type: "string" },
    noupnp: { type: "boolean", default: false },
    noupdate: { type: "boolean", default: false }
  }).argv;
  (0, import_utils2.launchFoundry)(".", argv);
  done();
}

// src/link.ts
var import_utils3 = require("@foundryvtt/utils");
var import_console = __toESM(require("console"));
var fse2 = __toESM(require("fs-extra"));
var import_path = __toESM(require("path"));
var import_process2 = __toESM(require("process"));
var import_yargs2 = __toESM(require("yargs"));
var import_helpers2 = require("yargs/helpers");
async function link(done) {
  const foundryPackage = await (0, import_utils3.getFoundryPackageInfo)();
  const foundryConfig = await (0, import_utils3.getFoundryConfigInfo)();
  if (!foundryPackage || !foundryConfig) return done();
  const linkDirectories = foundryConfig.resolvedDataPath.map((dataPath) => import_path.default.resolve(dataPath, "Data", foundryPackage.path));
  const argv = (0, import_yargs2.default)((0, import_helpers2.hideBin)(import_process2.default.argv)).options({
    clean: { type: "boolean", default: false }
  }).argv;
  const clean = argv.clean;
  for (const linkDirectory of linkDirectories) {
    if (clean) {
      import_console.default.log(`Removing build in ${linkDirectory}.`);
      await fse2.remove(linkDirectory);
    } else if (!await fse2.exists(linkDirectory)) {
      import_console.default.log(`Linking dist to ${linkDirectory}.`);
      await fse2.ensureDir("dist");
      await fse2.ensureDir(import_path.default.resolve(linkDirectory, ".."));
      await fse2.symlink(import_path.default.resolve("dist"), linkDirectory);
    } else {
      import_console.default.log(`Skipped linking to ${linkDirectory}, as it already exists.`);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildPacks,
  launch,
  link
});
