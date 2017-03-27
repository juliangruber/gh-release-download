#!/usr/bin/env node

const download = require('.')

const downloader = download()

downloader.events.on('start', name => console.log(`${name}...`))
downloader.events.on('finish', name => console.log(name))

downloader
.then(() => console.log('All downloaded'))
.catch(err => console.error(err))
