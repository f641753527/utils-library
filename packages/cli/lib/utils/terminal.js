var { spawn } = require('child_process')

const execCommand = (...argu) => {
  return new Promise((resolve) => {
    const childProcess = spawn(...argu)
    childProcess.stdout.pipe(process.stdout)
    childProcess.stderr.pipe(process.stderr)
    childProcess.on('close', () => {
      resolve()
    })
  })
}

module.exports = {
  execCommand
}