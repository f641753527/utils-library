var { program } = require('commander')

const optionHelper = () => {
  program
    .option('-d --dest <dest>', 'destination file localtion')
    // .option('-t --template <tmpname>', 'project template name')
}

module.exports = {
  optionHelper,
}
