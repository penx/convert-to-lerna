#!/usr/bin/env node

var commander = require('commander');
var chalk = require('chalk');
var {version} = require('./package.json');

commander
  .version(version);

commander.parse(process.argv);

console.log(chalk.green('Hi'));
