import { gqlPluckFromCodeString } from "@graphql-tools/graphql-tag-pluck";
import { DocumentNode, parse } from "graphql";
import { readFile } from "node:fs/promises";

export const parseQueryFile = async (
  queryPath: string
): Promise<DocumentNode[]> => {
  const body = await readFile(queryPath, { encoding: "utf8" });
  const srcs = await gqlPluckFromCodeString(queryPath, body);
  return srcs.map((s) => parse(s));
};
