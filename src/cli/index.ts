import { Command } from "commander";
import pkg from "../../package.json";

export const run = (argv: Array<string>): void => {
  program.parse(argv);
};

const program = new Command(pkg.name).version(pkg.version).helpOption(true);
