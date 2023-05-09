import { load as yamlLoad } from "https://deno.land/x/js_yaml_port@3.14.0/js-yaml.js";
import { posix } from "https://deno.land/std@0.173.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.186.0/fs/ensure_dir.ts";
import { emptyDir } from "https://deno.land/std@0.186.0/fs/empty_dir.ts";

const DATA_DIR = "./data";
const SCHEMA_DIR = "./schema";
const OUTPUT_DIR = "./dist";

async function importYamlFile(fn, dir = DATA_DIR) {
  return yamlLoad(await Deno.readTextFile(posix.join(dir, fn)));
}

const output = await importYamlFile("index.yaml");
for await (const f of Deno.readDir(DATA_DIR)) {
  if (f.name === "index.yaml") {
    continue;
  }
  const [_, col] = f.name.match(/^(.+)\.yaml$/);
  output[col] = await importYamlFile(f.name);
}

await emptyDir(OUTPUT_DIR);
const outputFile = posix.join(OUTPUT_DIR, "index.json");
await Deno.writeTextFile(outputFile, JSON.stringify(output, null, 2));
console.log(`file writed: ${outputFile}`);

// schemas

await ensureDir(posix.join(OUTPUT_DIR, "schema"));
const schemaBundle = await importYamlFile("index.yaml", SCHEMA_DIR);
for await (const f of Deno.readDir(SCHEMA_DIR)) {
  if (f.name === "index.yaml") {
    continue;
  }
  const [_, col] = f.name.match(/^(.+)\.yaml$/);
  const schema = await importYamlFile(f.name, SCHEMA_DIR);
  const fn = posix.join(OUTPUT_DIR, "schema", `${col}.json`);
  await Deno.writeTextFile(fn, JSON.stringify(schema, null, 2));
  console.log(`file writed: ${fn}`);
  schemaBundle.properties[col] = schema;
}
const outputSchemaBundle = posix.join(OUTPUT_DIR, "schema", "index.json");
await Deno.writeTextFile(
  outputSchemaBundle,
  JSON.stringify(schemaBundle, null, 2),
);
console.log(`file writed: ${outputSchemaBundle}`);
