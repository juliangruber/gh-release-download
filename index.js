'use strict'

const ghLatestRelease = require('gh-latest-release')
const gitRemoteOriginUrl = require('git-remote-origin-url')
const parseGitHubRepoUrl = require('parse-github-repo-url')
const throat = require('throat')
const got = require('got')
const fs = require('then-fs')
const pipe = require('promisepipe')
const EventEmitter = require('events')
const extrakt = require('extrakt')

const latest = opts => {
  opts = opts || {}
  const dir = opts.dir || process.cwd()
  const dst = opts.dst || `${process.cwd()}/dist/`
  const concurrency = opts.concurrency || 3

  const p = fs
    .mkdir(dst)
    .catch(err => {
      if (err.code !== 'EEXIST') throw err
    })
    .then(() => gitRemoteOriginUrl(dir))
    .then(url => parseGitHubRepoUrl(url))
    .then(repo => ghLatestRelease(`${repo[0]}/${repo[1]}`))
    .then(release => Promise.all(
      release.assets.map(
        throat(concurrency, asset => {
          p.events.emit('start', asset.name)
          const get = got.stream(asset.browser_download_url)
          const tmp = fs.createWriteStream(`/tmp/${asset.name}`)
          return pipe(get, tmp)
            .then(() =>
              extrakt(
                `/tmp/${asset.name}`,
                `${dst}/${asset.name.replace(/\.tar\.gz$/, '')}/`
              ))
            .then(() => p.events.emit('finish', asset.name))
        })
      )
    ))

  p.events = new EventEmitter()
  return p
}

module.exports = latest
