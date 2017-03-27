const download = require('.')

const downloader = download({
  dir: process.env.HOME + '/dev/level/leveldown'
})

downloader.events.on('start', name => console.log(`${name}...`))
downloader.events.on('finish', name => console.log(name))

downloader
.then(() => console.log('All downloaded'))
.catch(err => console.error(err))
