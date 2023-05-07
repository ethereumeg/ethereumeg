import { load as yamlLoad } from "https://deno.land/x/js_yaml_port@3.14.0/js-yaml.js";
import { posix } from "https://deno.land/std@0.173.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.186.0/fs/ensure_dir.ts";

const DATA_DIR = "./data";
const OUTPUT_DIR = "./dist";

const output = {};
for await (const f of Deno.readDir(DATA_DIR)) {
  const [_, col] = f.name.match(/^(.+)\.yaml$/);
  output[col] = await yamlLoad(
    await Deno.readTextFile(posix.join(DATA_DIR, f.name)),
  );
}

await ensureDir(OUTPUT_DIR);
const outputFile = posix.join(OUTPUT_DIR, "index.json");
await Deno.writeTextFile(outputFile, JSON.stringify(output, null, 2));
console.log(`file writed: ${outputFile}`);
