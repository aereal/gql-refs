import { buildSchema } from "graphql";
import assert from "node:assert";
import test from "node:test";
import { getPossibleReferences, Reference } from "./reference";

test("getPossibleReferences", () => {
  const schema = buildSchema(
    [
      "type User { name: String! profile: Profile! }",
      "type Profile { email: String! }",
      "type Query { user: User! }",
    ].join("\n")
  );
  const got = getPossibleReferences(schema);
  const want: Reference = {
    objects: {
      User: { fields: { name: 0, profile: 0 } },
      Profile: { fields: { email: 0 } },
      Query: { fields: { user: 0 } },
    },
  };
  assert.deepStrictEqual(got, want);
});
