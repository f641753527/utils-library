#! /usr/bin/env node
var { program } = require('commander')
var { optionHelper } = require('./lib/core/helper')
var createCommands = require('./lib/core/create')


function main() {
  // version
  program.version(require('./package.json').version)

  // options
  optionHelper()

  // command
  createCommands(process.argv)

  program.parse(process.argv)
}

main()
