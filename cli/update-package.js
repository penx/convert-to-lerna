#!/usr/bin/env node

var commander = require('commander');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var { version } = require('../package.json');

var pkg = require(path.resolve(process.cwd(), 'package.json'));

commander
  .version(version)
  .usage('<path>');

commander.parse(process.argv);

const packagePath = commander.args[0];

const package = require(path.resolve(process.cwd(), packagePath));

package.scripts = {
  ...package.scripts,
  build: "lerna run build",
}

package.workspaces = [
  "components/*",
  "packages/*"
]

package.private = true

package.jest.collectCoverageFrom.push(
  "components/*/src/**/*.{js,jsx}",
  "!components/*/node_modules",
  "!components/*/src/**/stories.js",
  "!components/*/src/**/example.js",
  "packages/*/src/**/*.{js,jsx}",
  "!packages/*/node_modules",
  "!packages/storybook",
  "!packages/*/src/**/stories.js",
  "!packages/*/src/**/example.js"
)

package.jest.testMatch.push(
  "<rootDir>/components/*/src/**/?(*.)(spec|test).js?(x)",
  "<rootDir>/packages/*/src/**/?(*.)(spec|test).js?(x)"
)

fs.writeFileSync(packagePath, JSON.stringify(package, undefined, 2));

fs.writeFileSync(path.resolve(process.cwd(), "lerna.json"), JSON.stringify({
  "lerna": "2.9.0",
  "npmClient": "yarn",
  "useWorkspaces": true
}, undefined, 2));
