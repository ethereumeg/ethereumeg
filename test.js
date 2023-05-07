import { posix } from "https://deno.land/std@0.173.0/path/mod.ts";
import { load as yamlLoad } from "https://deno.land/x/js_yaml_port@3.14.0/js-yaml.js";
import Ajv from "https://esm.sh/ajv@8.8.1?pin=v58";
import addFormats from "https://esm.sh/ajv-formats@2.1.1";

const DATA_DIR = './data'
const SCHEMA_DIR = './schema'

const ajv = new Ajv({ strict: false });
addFormats(ajv);

for await (const f of Deno.readDir(DATA_DIR)) {
    const data = await yamlLoad(await Deno.readTextFile(posix.join(DATA_DIR, f.name)))
    const schema = await yamlLoad(await Deno.readTextFile(posix.join(SCHEMA_DIR, f.name)))
    const validator = ajv.compile(schema)

    Deno.test(`${f.name}`, () => {
        if (!validator(data)) {
            throw validator.errors
        }
    })
}