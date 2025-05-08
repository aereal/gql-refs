import sade from "sade";
import pkg from "../../package.json";

export const run = (argv: Array<string>): void => program.parse(argv);

const program = sade(pkg.name, true);
program.version(pkg.version);
