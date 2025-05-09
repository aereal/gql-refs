import { Command } from "commander";
import pkg from "../../package.json";
import { countReferences } from "../count-references";
import { parseQueryFile } from "../parse-query";
import { parseSchemaFile } from "../parse-schema";
import {
  getPossibleReferences,
  mergeReferences,
  Reference,
} from "../reference";
import { MissingSchemaFileError } from "./errors";

export const run = (argv: Array<string>): void => {
  program.parse(argv);
};

const flatten = async <T>(values: Iterable<PromiseLike<T[]>>): Promise<T[]> =>
  (await Promise.all(values)).flat();

const doMain = async (
  queryPaths: Array<string>,
  schemaFilePath: string
): Promise<void> => {
  const schema = await parseSchemaFile(schemaFilePath);
  const results = await flatten(
    queryPaths.map(async (p) => {
      const docs = await parseQueryFile(p);
      return docs.map((d) => countReferences(schema, d));
    })
  );
  const r = results.reduce<Reference>(
    mergeReferences,
    getPossibleReferences(schema)
  );
  console.log(JSON.stringify(r));
};

const program = new Command(pkg.name)
  .version(pkg.version)
  .requiredOption("--schema <path>", "schema file path")
  .argument("<query...>", "query file(s)")
  .action((query: string[], opts: Record<string, unknown>) => {
    const schemaFilePath = opts["schema"];
    if (
      schemaFilePath === undefined ||
      typeof schemaFilePath !== "string" ||
      schemaFilePath === ""
    ) {
      throw new MissingSchemaFileError();
    }
    doMain(query, schemaFilePath);
  });
