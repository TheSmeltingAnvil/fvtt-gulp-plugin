import * as utils from '@foundryvtt/utils';
import * as YAML from 'js-yaml';

/**
 * Build packs: convert to JSON, compile packs database and copy to output directory.
 * @param distPath
 * @param distPath
 * @param {*} done Callback to notify task completes.
 */
declare function buildPacks(done: () => void): Promise<void>;

declare function extractPack(directory: string, documentType: utils.DocumentType, { yamlOptions }?: {
    yamlOptions: YAML.DumpOptions;
}): Promise<void>;

/**
 * Launch Foundry VTT server locally.
 * @returns: Promise<void>
 */
declare function launch(done: () => void): Promise<void>;

/********************/
/********************/
/**
 * Link dist directory to first existing Foundry User Data folder
 * @returns: Promise<void>
 */
declare function link(done: () => void): Promise<void>;

export { buildPacks, extractPack, launch, link };
