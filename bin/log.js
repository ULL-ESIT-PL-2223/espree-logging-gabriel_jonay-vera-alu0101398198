#!/usr/bin/env node

//import { program } from "commander";
const { program } = require("commander");
//import { createRequire } from "module";
const createRequire = require("module").createRequire;
const require = createRequire(import.meta.url);
const { version } = require("../package.json");
//import { transpile } from "../src/logging-espree.js";
const { transpile } = require("../src/logging-espree.js");

program
  .version(version)
  .argument("<filename>", 'file with the original code')
  .option("-o, --output <filename>", "file in which to write the output")
  .action((filename, options) => {
    transpile(filename, options.output);
  });

program.parse(process.argv);
