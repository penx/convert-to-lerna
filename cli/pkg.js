#!/usr/bin/env node

var commander = require('commander');
var path = require('path');
var chalk = require('chalk');
var { version } = require('../package.json');

var pkg = require(path.resolve(process.cwd(), 'package.json'));

commander
  .version(version)
  .usage('[options] <component>')
  .option('-n, --namespace <string>', 'namespace');

commander.parse(process.argv);

const component = commander.args[0];
const { namespace = pkg.name } = commander;

console.log(JSON.stringify({
  "name": namespace ? `@${namespace}/${component}` : component,
  "version": pkg.version,
  "dependencies": {
    "govuk-colours": pkg.dependencies["govuk-colours"],
    "@govuk-react/constants": pkg.version
  },
  "peerDependencies": pkg.peerDependencies,
  "devDependencies": {
    "react-dom": pkg.devDependencies["react-dom"],
    "enzyme": pkg.devDependencies["enzyme"],
    "@storybook/react": pkg.devDependencies["@storybook/react"],
    "@storybook/addon-actions": pkg.devDependencies["@storybook/addon-actions"]
  },
  "scripts": {
    "build": "npm run build:lib && npm run build:es",
    "build:lib": pkg.scripts["build:lib"],
    "build:es": pkg.scripts["build:es"]
  },
  "main": "lib/index.js",
  "module": "es/index.js"
}, undefined, 2));
