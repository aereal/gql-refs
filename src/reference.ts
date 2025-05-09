import {
  GraphQLCompositeType,
  GraphQLField,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  isObjectType,
} from "graphql";

export const increaseReference = (
  ref: Reference,
  objectType: GraphQLCompositeType,
  fieldType: GraphQLField<unknown, unknown>
): void => {
  const objectName = objectType.toString();
  const fieldName = fieldType.name;
  if (ref.objects[objectName] === undefined) {
    ref.objects[objectName] = {
      fields: {
        [fieldName]: 1,
      },
    };
    return;
  }
  if (ref.objects[objectName].fields[fieldName] === undefined) {
    ref.objects[objectName].fields[fieldName] = 1;
    return;
  }
  ref.objects[objectName].fields[fieldName] =
    ref.objects[objectName].fields[fieldName] + 1;
};

export const getPossibleReferences = (schema: GraphQLSchema): Reference => {
  const typMap = schema.getTypeMap();
  return {
    objects: Object.keys(typMap).reduce<ObjectReferences>(
      mergeObjectReferences(typMap),
      {}
    ),
  };
};

const appendFieldReferences = (
  typName: string,
  typ: GraphQLObjectType
): ObjectReferences => ({
  [typName]: {
    fields: Object.keys(typ.getFields()).reduce<FieldReferences>(
      (accum, fieldName) => ({ ...accum, [fieldName]: 0 }),
      {}
    ),
  },
});

const mergeObjectReferences =
  (typMap: Record<string, GraphQLNamedType>) =>
  (accum: ObjectReferences, typName: string): ObjectReferences => {
    const typ = typMap[typName];
    return isObjectType(typ) && !typName.startsWith("__")
      ? { ...accum, ...appendFieldReferences(typName, typ) }
      : accum;
  };

export const mergeReferences = (a: Reference, b: Reference): Reference => ({
  objects: mergeObject(a.objects, b.objects),
});

const mergeField = (
  a: FieldReferences,
  b: FieldReferences
): FieldReferences => {
  const ret = Object.fromEntries(Object.entries(a));
  for (const key of Object.keys(b)) {
    const v = b[key];
    if (ret[key] === undefined) {
      ret[key] = v;
    } else {
      ret[key] = ret[key] + v;
    }
  }
  return ret;
};

const mergeObject = (
  a: ObjectReferences,
  b: ObjectReferences
): ObjectReferences => {
  const ret = Object.fromEntries(Object.entries(a));
  for (const key of Object.keys(b)) {
    const v = b[key];
    if (ret[key] === undefined) {
      ret[key] = v;
      continue;
    }
    ret[key] = {
      fields: mergeField(ret[key].fields, v.fields),
    };
  }
  return ret;
};

type FieldReferences = {
  [fieldName: string]: number;
};

interface ObjectReference {
  readonly fields: FieldReferences;
}

type ObjectReferences = {
  [objectName: string]: ObjectReference;
};

export interface Reference {
  readonly objects: ObjectReferences;
}
