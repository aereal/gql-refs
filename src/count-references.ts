import {
  DocumentNode,
  GraphQLSchema,
  Kind,
  TypeInfo,
  visit,
  visitWithTypeInfo,
} from "graphql";
import { Reference, increaseReference } from "./reference";

export const countReferences = (
  schema: GraphQLSchema,
  doc: DocumentNode
): Reference => {
  const ti = new TypeInfo(schema);
  const ret: Reference = { objects: {} };
  visit(
    doc,
    visitWithTypeInfo(ti, {
      [Kind.FIELD]: () => {
        const parentType = ti.getParentType();
        if (parentType === null || parentType === undefined) {
          return;
        }
        const fieldDef = ti.getFieldDef();
        if (fieldDef === null || fieldDef === undefined) {
          return;
        }
        increaseReference(ret, parentType, fieldDef);
      },
    })
  );
  return ret;
};
