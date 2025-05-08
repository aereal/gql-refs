import { readFile } from "fs/promises";
import { buildASTSchema, GraphQLSchema, parse, Source } from "graphql";

export const parseSchemaFile = async (
  schemaFilePath: string
): Promise<GraphQLSchema> => {
  const body = await readFile(schemaFilePath, { encoding: "utf8" });
  const src = new Source(body, schemaFilePath);
  return buildASTSchema(parse(src));
};
