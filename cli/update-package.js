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

fs.writeFileSync(packagePath, JSON.stringify(package, undefined, 2));

fs.writeFileSync(path.resolve(process.cwd(), "lerna.json"), JSON.stringify({
  "lerna": "2.9.0",
  "npmClient": "yarn",
  "useWorkspaces": true
}, undefined, 2));
