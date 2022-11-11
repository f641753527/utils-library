var { promisify } = require('util')
var { execCommand } = require('../utils/terminal')
var download = promisify(require('download-git-repo'))
var { templateUrls, startCommand } = require('./config')


async function createProject(url, project, startCommand) {
  // 1. download repository
  await download(`direct:${url}`, project, { clone: true })
  // 2. npm install
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  await execCommand(command, ['install'], { cwd: `./${project}` })
  // 3. npm run serve
  execCommand(command, ['run', startCommand], { cwd: `./${project}` })
  // 4. open broswer
  // open('http://localhost:8080')
}

const createAction = (project, { template = 'vue' }) => {
  console.log(`phoenix is helping you init your ${template} project`)
  const url = templateUrls[template] ? templateUrls[template] : templateUrls.vue
  const serve = startCommand[template] ? startCommand[template] : startCommand.vue
  createProject(url, project, serve)
}

module.exports = {
  createAction
}
