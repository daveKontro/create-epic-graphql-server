#! /usr/bin/env node
const { writeFile } = require('fs/promises')
const { execSync } = require('child_process')
const path = require('path')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const packageJson = require('../package.json')

const run = async () => {
  const repo = 'https://github.com/daveKontro/create-epic-graphql-server/tarball/main'

  const execCommand = (command) => {
    try {
      execSync(command, { stdio: 'inherit' })
    } catch (error) {
      console.error(`${command} failed`, error)
      process.exit(1)
    }

    return true
  }

  // consume arguments
  const argv = yargs(hideBin(process.argv)).argv

  if (!argv.name) {
    console.error('WARNING add a project name like so: npx create-epic-graphql-server --name={my-project}')
    process.exit(1)
  }

  const projectPaths = {
    root: path.resolve('.', argv.name),
    get bin() { return path.resolve(this.root, 'bin') },
    get env() { return path.resolve(this.root, '.env') },
    get packageJson() { return path.resolve(this.root, 'package.json') },
  }

  const isNameDotCommand = (argv.name === '.')
  const projectName = isNameDotCommand ? path.basename(process.cwd()) : argv.name

  console.info('')
  console.info(`Your project name is: ${projectName}`)
  console.info('')

  // create project
  execCommand(`curl -L ${repo} | tar zx --one-top-level=${argv.name} --strip-components 1`)

  // groom project
  if (packageJson.hasOwnProperty('name')) packageJson.name = projectName
  if (packageJson.hasOwnProperty('version')) packageJson.version = '1.0.0'
  if (packageJson.hasOwnProperty('description')) packageJson.description = ''
  if (packageJson.hasOwnProperty('author')) packageJson.author = ''
  if (packageJson.hasOwnProperty('bin')) delete packageJson.bin
  if (packageJson.hasOwnProperty('repository')) delete packageJson.repository
  if (packageJson.dependencies.hasOwnProperty('yargs')) delete packageJson.dependencies.yargs

  execCommand(`rm ${projectPaths.packageJson}`)
  execCommand(`rm -rf ${projectPaths.bin}`)

  try {
    await writeFile(projectPaths.packageJson, JSON.stringify(packageJson, null, 2), {
      encoding: 'utf8',
    })
  } catch (error) {
    console.error('package.json creation failed', error)
    process.exit(1)
  }

  execCommand(`touch ${projectPaths.env}`)

  // install project dependencies
  execCommand(`npm --prefix ${projectPaths.root} install`)

  // finish up
  console.info('')
  console.info('Thanks for using Create Epic GraphQL Server!')

  process.exit(0)
}

run()
