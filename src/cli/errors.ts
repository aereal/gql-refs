export class MissingSchemaFileError extends Error {
  public readonly message = "missing schema file";
}

export class NoQueryGivenError extends Error {
  public readonly message = "no query given";
}
