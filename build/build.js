const rollup = require('rollup').rollup
const flow = require('rollup-plugin-flow-no-whitespace')
const resolve = require('path').resolve
const buble = require('rollup-plugin-buble')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const chalk = require('chalk')
const rollupOptionsBuild = require('./config/rollup-options-build')
const rollupOptionsTest = require('./config/rollup-options-test')

function success (text) {
  console.log(chalk.green(`${text} ✔`))
}

function error (text) {
  console.log(chalk.red(`${text} ✘`))
}

const rollupOptions = process.env.NODE_ENV === 'test' ? rollupOptionsTest : rollupOptionsBuild

rollupOptions.forEach(options => {
  rollup({
    entry: resolve('src/index.js'),
    external: ['kdu', 'kdu-template-compiler'],
    plugins: [
      flow(),
      buble({
        objectAssign: 'Object.assign'
      }),
      nodeResolve(),
      commonjs()
    ]
  }).then(bundle => {
    bundle.write(options)
  })
    .then(() => success(`${options.format} build successful`))
    .catch((err) => {
      error(err)
    })
})
