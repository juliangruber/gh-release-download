#!/usr/bin/env node

const download = require('.')
const differ = require('ansi-diff-stream')
const checkmarks = require('checkmarks')
const chalk = require('chalk')
const spinners = require('cli-spinners')

const downloader = download()
const assets = {}
const spinner = spinners.dots

downloader.events.on('start', name => {
  assets[name] = false
})
downloader.events.on('finish', name => {
  assets[name] = true
})

downloader
  .then(() => {
    render()
    process.exit()
  })
  .catch(err => console.error(err))

const diff = differ()
let frameIdx = 0

const render = () => {
  const frame = spinner.frames[frameIdx]
  frameIdx = (frameIdx + 1) % spinner.frames.length

  diff.write(
    Object.keys(assets)
      .sort()
      .map(
        name =>
          `  ${(assets[name] && chalk.green(checkmarks(true))) || frame} ${name}`
      )
      .join('\n')
  )
}

setInterval(render, spinner.interval)
diff.pipe(process.stdout)
