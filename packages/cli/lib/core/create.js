var { program } = require('commander');
var { createAction } = require('./actions')

const createCommands = () => {
  program
    .command('create')
    .argument('<project>', 'project name')
    .option('-t, --template <template>', 'add the specified template of project')
    .description('cleate a repository into local')
    .action(createAction)
}

module.exports = createCommands